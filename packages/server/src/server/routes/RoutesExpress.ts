import {FileStorageLocal} from '../../core/fileStorage/FileStorageLocal.js'
import {Api} from '@infoportal/api-sdk'
import {z} from 'zod'
import {ControllerUser} from '../controller/ControllerUser.js'
import {PrismaClient} from '@infoportal/prisma/dist/index.js'
import {appConf, AppConf} from '../../core/AppConf.js'
import {app, AppLogger} from '../../index.js'
import * as core from 'express-serve-static-core'
import {ControllerMain} from '../controller/ControllerMain.js'
import {ControllerKoboApi} from '../controller/kobo/ControllerKoboApi.js'
import {ControllerSession} from '../controller/ControllerSession.js'
import {ControllerCache} from '../controller/ControllerCache.js'
import {ControllerKoboApiXlsImport} from '../controller/kobo/ControllerKoboApiXlsImport.js'
import {SubmissionAttachmentsService} from '../../feature/form/submission/SubmissionAttachmentsService.js'
import {Router} from './Router.js'
import {NextFunction, Request, Response} from 'express'

export class RoutesExpress extends Router {
  constructor(
    protected server: core.Express,
    protected router: core.Router,
    protected prisma: PrismaClient,
    protected conf: AppConf = appConf,
    protected log: AppLogger = app.logger('RoutesExpress'),
  ) {
    super(prisma)
  }

  private readonly safe = <T extends Request>(
    handler: (req: T, res: Response, next: NextFunction) => Promise<void>,
  ) => {
    return async (req: T, res: Response, next: NextFunction) => {
      try {
        await handler(req, res, next)
      } catch (err) {
        // this.log.error('safe(): ' + req.url + '' + req.session.app?.user.email)
        next(err)
      }
    }
  }

  readonly register = () => {
    const r = this.router
    const main = new ControllerMain()
    const koboApi = new ControllerKoboApi(this.prisma)
    const session = new ControllerSession(this.prisma)
    const cacheController = new ControllerCache()
    const importData = new ControllerKoboApiXlsImport(this.prisma)
    const submissionAttachment = new SubmissionAttachmentsService(this.prisma)

    if (!this.conf.production) {
      const {path, handler} = new FileStorageLocal().getExpressRoute()
      this.router.get(path, this.authMiddleware(), handler)
    }
    try {
      r.get(
        `/workspaces/:workspaceId/forms/:formId/submissions/:submissionId/attachment/:attachmentName`,
        this.safe(async (req, res) => {
          const schema = z.object({
            workspaceId: z.string(),
            formId: z.string(),
            submissionId: z.string(),
            attachmentName: z.string(),
          })
          console.log(req.params, req.path)
          const params = schema.parse(req.params)
          const workspaceId = params.workspaceId as Api.WorkspaceId
          const formId = params.formId as Api.FormId
          const submissionId = params.submissionId as Api.SubmissionId
          const attachmentName = params.attachmentName
          const url = await submissionAttachment.getUrl({
            workspaceId,
            formId,
            submissionId,
            attachmentName,
          })
          res.redirect(url)
        }),
      )

      r.get('/', this.safe(main.ping))
      r.post('/session/track', this.safe(session.track))
      r.post('/session/login', this.safe(session.login))
      r.post(
        '/session/connect-as',
        this.authMiddleware({access: {workspace: ['user_canConnectAs']}}),
        this.safe(session.connectAs),
      )
      r.post('/session/connect-as-revert', this.authMiddleware(), this.safe(session.revertConnectAs))
      r.delete('/session', this.safe(session.logout))
      r.get('/session/me', this.safe(session.getMe))

      r.post('/proxy-request', this.safe(main.proxy))

      r.post('/kobo-api/webhook', this.safe(koboApi.handleWebhookNewAnswers))
      r.post(
        '/kobo-api/sync',
        this.authMiddleware({access: {workspace: ['form_canGetAll']}}),
        this.safe(koboApi.syncAnswersAll),
      )
      r.post('/kobo-api/schema', this.authMiddleware(), this.safe(koboApi.searchSchemas))
      r.post('/kobo-api/:formId/sync', this.authMiddleware(), this.safe(koboApi.syncAnswersByForm))
      r.get(ControllerKoboApi.getAttachmentPath(), this.authMiddleware(), this.safe(koboApi.getAttachment))
      r.get('/kobo-api/:formId/edit-url/:answerId', this.safe(koboApi.edit))
      r.post('/kobo-api/proxy', this.safe(koboApi.proxy))
      r.post(
        '/kobo-api/:formId/import-from-xls',
        this.authMiddleware(),
        this.multerDisk.single('uf-import-answers'),
        this.safe(importData.handleFileUpload),
      )

      r.get('/user/avatar/:email', this.authMiddleware(), this.safe(new ControllerUser(this.prisma).avatar))
      r.get('/cache', cacheController.get)
      r.post('/cache/clear', cacheController.clear)
    } catch (e) {
      if (e instanceof Error) {
        this.log.error(e.toString())
      }
      this.log.error(e)
      console.error('Route error', e)
    }
    this.server.use(r)
  }
}
