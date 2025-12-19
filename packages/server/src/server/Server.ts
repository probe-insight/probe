import express, {NextFunction, Request, Response} from 'express'
import bodyParser from 'body-parser'
import {app} from '../index.js'
import {appConf, AppConf} from '../core/AppConf.js'
import {HttpError} from '@infoportal/api-sdk'
import session from 'express-session'
import {PrismaSessionStore} from '@quixo3/prisma-session-store'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import {duration} from '@axanc/ts-utils'
// import * as Sentry from '@sentry/node'
// import sessionFileStore from 'session-file-store'
import {Server as SocketIOServer} from 'socket.io'
import {PermissionService} from '../feature/PermissionService.js'
import {Socket} from './Socket.js'
import {PrismaClient} from '@infoportal/prisma'
import {RoutesExpress} from './routes/RoutesExpress.js'
import {RoutesTsRest} from './routes/RoutesTsRest.js'
import {ErrorHttpStatusCode} from '@ts-rest/core'
import {ZodError} from 'zod'
import {genUUID} from '@infoportal/common'

export class Server {
  constructor(
    private conf: AppConf = appConf,
    private pgClient: PrismaClient,
    private server = express(),
    // private httpServer = createServer(this.server),
    private log = app.logger('Server'),
  ) {}

  readonly errorHandler = (e: Error, req: Request, res: Response, next: (err?: any) => void) => {
    const errorId = genUUID().split('-')[0]

    const statusMap = new Map<Function, ErrorHttpStatusCode>([
      [HttpError.Conflict, 409],
      [HttpError.Forbidden, 403],
      [HttpError.NotFound, 404],
      [ZodError, 400],
    ])

    const status = Array.from(statusMap.entries()).find(([ErrClass]) => e instanceof ErrClass)?.[1] ?? 500

    const errorMessage =
      e instanceof ZodError
        ? 'ZodError: ' + e.errors.map(i => i.path.join('.')).join(', ')
        : status + ':' + e.name + ' - ' + e.message

    this.log.error(`${req.path} errorId=${errorId} - ${errorMessage}`)
    if (status === 500) console.log(e)
    res.status(status).json({
      status,
      body: {
        errorId,
        message: e.message,
        data: (e as any)?.data,
      },
    })
  }

  readonly start = () => {
    // new IpSentry(this.conf, app,)
    // this.server.use(Sentry.Handlers.requestHandler())
    // this.server.use(Sentry.Handlers.tracingHandler())

    const sessionMiddleware = session({
      secret: this.conf.sessionSecret,
      resave: false,
      saveUninitialized: false,
      name: 'infoportal-session2',
      // proxy: true,
      unset: 'destroy',
      store: new PrismaSessionStore(this.pgClient, {
        checkPeriod: duration(1, 'day').toMs,
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }),
      cookie: {
        domain: undefined, //appConf.production ? '.drc.ngo' : undefined,
        secure: this.conf.production,
        // httpOnly: true,
        sameSite: this.conf.production ? 'none' : undefined,
        maxAge: duration(30, 'day').toMs,
      },
    })

    this.server.set('trust proxy', 1)
    // this.server.use(this.corsHeader)
    this.server.use(
      cors({
        credentials: true,
        origin: this.conf.cors.allowOrigin,
        optionsSuccessStatus: 200,
      }),
    )
    // const sessionstore = sessionFileStore(session)
    this.server.use(cookieParser())
    this.server.use(sessionMiddleware)
    this.server.use(bodyParser.json({limit: '512mb'}))
    this.server.use(bodyParser.urlencoded({extended: false}))
    if (!this.conf.production)
      this.server.use(function artificialNetworkDelay(req, res, next) {
        const delay = 50 + Math.random() * 200
        setTimeout(next, delay)
      })

    const router = express.Router()
    new RoutesExpress(this.server, router, this.pgClient).register()
    new RoutesTsRest(this.server, router, this.pgClient).register()

    // this.server.use(Sentry.Handlers.errorHandler())
    this.server.use(this.errorHandler)
    const httpServer = this.server.listen(
      this.conf.port,
      /*'0.0.0.0',*/ () => {
        this.log.info(`server start listening on port ${this.conf.port}`)
      },
    )
    const io = new SocketIOServer(httpServer, {
      cors: {
        origin: this.conf.cors.allowOrigin,
        credentials: true,
      },
    })
    io.use((socket, next) => {
      return sessionMiddleware(socket.request as Request, {} as Response, next as NextFunction)
    })
    io.use(async (socket, next) => {
      try {
        const req = socket.request as express.Request
        const permission = new PermissionService(this.pgClient)
        if (await permission.checkUserConnected(req)) next()
      } catch (err: any) {
        next(err)
      }
    })
    new Socket(io)
    // new AppWebsocket(httpServer).init()
  }
}
