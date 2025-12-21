import {Kobo} from 'kobo-sdk'
import {Api} from '@infoportal/api-sdk'
import {useMemo} from 'react'
import {Datatable} from '@/shared'
import {useAppSettings} from '@/core/context/ConfigContext'

export const SubmissionImg = ({
  fileName,
  size,
  workspaceId,
  formId,
  submissionId,
  tooltipSize = 450,
}: {
  workspaceId: Api.WorkspaceId
  formId: Api.FormId
  submissionId: Api.SubmissionId
  size?: number
  tooltipSize?: number | null
  fileName?: string
}) => {
  const {apiv2} = useAppSettings()

  const url = useMemo(() => {
    if (!fileName) return
    return apiv2.submission.getAttachmentUrl({formId, submissionId, workspaceId, fileName})
  }, [fileName])

  return fileName && <Datatable.Img size={size} tooltipSize={tooltipSize} url={url} />
}
