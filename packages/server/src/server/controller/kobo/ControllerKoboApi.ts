import {NextFunction, Request, Response} from 'express'
import * as yup from 'yup'
import {PrismaClient} from '@infoportal/prisma'
import {KoboSdkGenerator} from '../../../feature/kobo/KoboSdkGenerator.js'
import {KoboSyncServer} from '../../../feature/kobo/KoboSyncServer.js'
import axios, {AxiosError} from 'axios'
import {Api} from '@infoportal/api-sdk'
import {Kobo} from 'kobo-sdk'
import {z} from 'zod'

export class ControllerKoboApi {
  constructor(
    private pgClient: PrismaClient,
    private syncService = new KoboSyncServer(pgClient),
    private koboSdkGenerator = KoboSdkGenerator.getSingleton(pgClient),
  ) {}

  private readonly extractParams = async (req: Request) => {
    const schema = yup.object({
      formId: yup.string().required(),
    })
    return await schema.validate(req.params)
  }

  readonly searchSchemas = async (req: Request, res: Response, next: NextFunction) => {
    const {serverId} = await yup
      .object({
        serverId: yup.string().required(),
      })
      .validate(req.body)
    const sdk = await this.koboSdkGenerator.getBy.accountId(serverId as Api.Kobo.AccountId)
    const forms = await sdk.v2.form.getAll()
    res.send(forms)
  }

  readonly handleWebhookNewAnswers = async (req: Request, res: Response, next: NextFunction) => {
    const formId = req.body._xform_id_string
    await this.syncService.handleWebhookNewAnswers({koboFormId: formId, answer: req.body})
    res.send({})
  }

  readonly syncAnswersAll = async (req: Request, res: Response, next: NextFunction) => {
    await this.syncService.syncApiAnswersToDbAll(req.session.app?.user.email)
    res.send()
  }

  readonly syncAnswersByForm = async (req: Request, res: Response, next: NextFunction) => {
    const {formId} = await this.extractParams(req)
    await this.syncService.syncApiAnswersToDbByForm({formId: formId as any, updatedBy: req.session.app?.user.email})
    res.send()
  }

  readonly edit = async (req: Request, res: Response, next: NextFunction) => {
    const {formId} = await this.extractParams(req)
    const answerId = await yup.string().required().validate(req.params.answerId)
    const sdk = await this.koboSdkGenerator.getBy.koboFormId(formId)
    const link = await sdk.v2.submission.getEditLinkUrl({formId, submissionId: answerId})

    //   res.send(`
    //   <!DOCTYPE html>
    //   <html>
    //   <head>
    //     <title>Set Cookie and Redirect</title>
    //     <script>
    //       document.addEventListener("DOMContentLoaded", function() {
    //         document.cookie = "kobonaut__eu_kobotoolbox_org=9qjoc9o3ck2c8hkgldp4brz6iviqw8xt; domain=.kobotoolbox.org; path=/; SameSite=Lax; Secure"
    //         window.location.href = '${link.url}'
    //       })
    //     </script>
    //   </head>
    //   <body>
    //     <p>Setting cookie and redirecting...</p>
    //   </body>
    //   </html>
    // `);

    // // TODO Find a way to authenticate
    // // res.header('Authorization', v2.makeAuthorizationHeader(appConf.kobo.token))
    res.cookie('kobonaut__eu_kobotoolbox_org', '9qjoc9o3ck2c8hkgldp4brz6iviqw8xt', {
      domain: '.kobotoolbox.org',
      expires: new Date('2025-07-26T12:04:26.655Z'),
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    })
    res.redirect(link.url)
  }

  static readonly getAttachmentPath = ({
    koboFormId = ':koboFormId' as any,
    koboSubmissionId = ':koboSubmissionId' as any,
    attachmentUid = ':attachmentUid',
  }: {
    koboFormId?: Kobo.FormId
    koboSubmissionId?: Kobo.SubmissionId
    attachmentUid?: string
  } = {}) => `/kobo-api/${koboFormId}/submission/${koboSubmissionId}/attachment/${attachmentUid}`

  readonly getAttachment = async (req: Request, res: Response, next: NextFunction) => {
    const {attachmentUid, koboSubmissionId, koboFormId} = z
      .object({
        koboFormId: z.string(),
        attachmentUid: z.string(),
        koboSubmissionId: z.string(),
      })
      .parse(req.params)

    const fileName = req.query.fileName
    const sdk = await this.koboSdkGenerator.getBy.koboFormId(koboFormId)
    try {
      const img = await sdk.v2.submission.getAttachement({
        submissionId: koboSubmissionId,
        attachmentId: attachmentUid,
        formId: koboFormId,
      })
      if (!fileName) {
        res.set({
          'Cache-Control': 'private, max-age=0',
          // FIXME Get actual MimeType
          'Content-Type': 'application/octet-stream',
          // 'Content-Length': img.length,
        })
      } else {
        res.set(`Content-Disposition`, `inline; filename="${fileName}"`)
      }
      res.send(img)
    } catch (e) {
      console.log('ControllerKoboApi/getAttachmentsWithoutAuth', (e as AxiosError).code)
      res.sendStatus(404)
    }
  }

  readonly proxy = async (req: Request, res: Response, next: NextFunction) => {
    const body = await yup
      .object({
        formId: yup.string().required(),
        url: yup.string().required(),
        method: yup.string().required(),
        body: yup.mixed<any>().optional(),
        headers: yup.mixed<any>().optional(),
      })
      .validate(req.body)
    const server = await this.koboSdkGenerator.getServerBy.formId(body.formId)
    try {
      const request = await axios.create().request({
        url: body.url,
        method: body.method,
        headers: {
          ...body.headers,
          Authorization: 'Token ' + server.token,
        },
        params: body.body,
      })
      res.send(request.data)
    } catch (e) {
      console.log('ControllerKoboApi/proxy', (e as AxiosError).code)
      next(e)
    }
  }
}
