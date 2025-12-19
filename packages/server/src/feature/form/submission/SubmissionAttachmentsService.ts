import {appConf} from '../../../core/AppConf.js'
import {FileStorage} from '../../../core/fileStorage/FileStorage.js'
import {app} from '../../../index.js'
import {Api} from '@infoportal/api-sdk'
import {nanoid} from 'nanoid'
import {Kobo} from 'kobo-sdk'
import {duration} from '@axanc/ts-utils'

export class SubmissionAttachmentsService {
  constructor(
    private conf = appConf,
    private fileStorage = FileStorage.getInstance(conf),
    private log = app.logger('SubmissionAttachmentsService'),
  ) {}

  static readonly genId = nanoid

  static readonly getPath = ({
    formId,
    submissionId,
    attachmentName,
  }: {
    formId: Api.FormId
    submissionId: Api.SubmissionId
    attachmentName: string
  }) => `/${formId}/submission/${submissionId}/${attachmentName}`

  readonly makeAttachment = ({
    fileName,
    filePath,
    question_xpath,
  }: {
    question_xpath: string
    filePath: string
    fileName: string
  }): Kobo.Submission.Attachment => {
    return {
      uid: SubmissionAttachmentsService.genId(),
      question_xpath: question_xpath,
      filename: fileName,
      download_url: this.fileStorage.url({filePath}),
      download_small_url: this.fileStorage.url({filePath}),
    }
  }

  readonly removeForSubmission = async ({
    formId,
    submissionId,
  }: {
    formId: Api.FormId
    submissionId: Api.SubmissionId
  }) => {
    // TODO Keep all files while we are in beta. Build proper cleaning scheduled task.
    // return this.fileStorage.remove({filePath: `/${formId}/submission/${submissionId}`})
  }

  readonly removeForForm = async ({formId}: {formId: Api.FormId}) => {
    return this.fileStorage.remove({filePath: `/${formId}`})
  }

  readonly save = async ({
    formId,
    submissionId,
    fileNameToXPath,
    attachmentFiles: files,
  }: {
    fileNameToXPath: Record<string, string>
    formId: Api.FormId
    submissionId: Api.SubmissionId
    attachmentFiles?: Express.Multer.File[]
  }): Promise<Kobo.Submission.Attachment[]> => {
    if (!files || files.length === 0) return []
    return Promise.all(
      files.map(async attachment => {
        const filePath = SubmissionAttachmentsService.getPath({
          formId,
          submissionId,
          attachmentName: attachment.originalname,
        })
        await this.fileStorage.upload({
          filePath,
          data: attachment.buffer,
        })
        return this.makeAttachment({
          fileName: attachment.originalname,
          filePath,
          question_xpath: fileNameToXPath[attachment.originalname],
        })
      }),
    )
  }

  readonly getUrl = async ({
    workspaceId,
    formId,
    submissionId,
    attachmentName,
  }: {
    workspaceId: Api.WorkspaceId
    formId: Api.FormId
    submissionId: Api.SubmissionId
    attachmentName: string
  }) => {
    const storagePath = SubmissionAttachmentsService.getPath({formId, submissionId, attachmentName})
    return this.fileStorage.getSignedUrl(storagePath, {
      expiresInMs: duration(5, 'minute'),
    })
  }
}
