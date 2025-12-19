import {AppConf} from '../AppConf.js'
import {FileStorageLocal} from './FileStorageLocal.js'

export interface FileStorageInterface {
  upload(params: {filePath: string; data: Buffer | Uint8Array}): Promise<void>

  get(params: {filePath: string}): Promise<Buffer>

  remove(params: {filePath: string}): Promise<void>

  url(params: {filePath: string}): string

  getSignedUrl(
    filePath: string,
    {
      expiresInMs,
    }: {
      expiresInMs: number
    },
  ): Promise<string>

  verifySignedUrl(params: {filePath: string; expires: number; signature: string}): boolean
}

export class FileStorage {
  private constructor() {}

  static instance: FileStorageInterface | null = null

  static readonly getInstance = (config: AppConf): FileStorageInterface => {
    if (!this.instance) {
      if (config.production) {
        throw new Error('TODO')
      } else {
        this.instance = new FileStorageLocal()
      }
    }
    return this.instance
  }
}
