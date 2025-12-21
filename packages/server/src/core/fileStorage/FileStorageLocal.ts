import {promises as fs} from 'fs'
import * as path from 'path'
import {FileStorageInterface} from './FileStorage.js'
import {appConf} from '../AppConf.js'
import {app} from '../../index.js'
import crypto from 'crypto'
import {Request, Response} from 'express'

export class FileStorageLocal implements FileStorageInterface {
  constructor(
    private conf = appConf,
    private root = conf.rootProjectDir + '/.file-storage',
    private log = app.logger('FileStorageLocal'),
  ) {
    console.log(conf.rootProjectDir + '/.file-storage')
  }

  private fullPath(p: string) {
    return path.join(this.root, p)
  }

  async upload({filePath, data}: Parameters<FileStorageInterface['upload']>[0]) {
    const file = this.fullPath(filePath)
    await fs.mkdir(path.dirname(file), {recursive: true})
    await fs.writeFile(file, data)
  }

  async get({filePath}: Parameters<FileStorageInterface['get']>[0]) {
    return fs.readFile(this.fullPath(filePath))
  }

  async remove({filePath}: Parameters<FileStorageInterface['remove']>[0]) {
    await fs
      .rm(this.fullPath(filePath), {
        recursive: true,
        force: true,
      })
      .catch(e => {
        this.log.error(e.message)
      })
  }

  url({filePath}: Parameters<FileStorageInterface['url']>[0]) {
    return `/dev-files/${filePath}`
  }

  async getSignedUrl(
    filePath: string,
    {
      expiresInMs,
    }: {
      expiresInMs: number
    },
  ) {
    const expires = Date.now() + expiresInMs
    const sig = this.sign(filePath, expires)
    return `/dev-files${filePath}?expires=${expires}&sig=${sig}`
  }

  private sign(filePath: string, expires: number) {
    return crypto.createHmac('sha256', this.conf.fileSigningSecret).update(`${filePath}:${expires}`).digest('hex')
  }

  verifySignedUrl({filePath, expires, signature}: {filePath: string; expires: number; signature: string}) {
    if (Date.now() > expires) return false
    const expected = this.sign(filePath, expires)
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  }

  getExpressRoute() {
    return {
      path: '/dev-files/*',
      handler: async (req: Request, res: Response) => {
        try {
          const filePath = '/' + req.params[0] // everything after /files/local/
          const expires = Number(req.query.expires)
          const sig = String(req.query.sig ?? '')

          if (!filePath || !expires || !sig) {
            return res.status(400).send('Invalid signed URL')
          }

          const valid = this.verifySignedUrl({
            filePath,
            expires,
            signature: sig,
          })

          if (!valid) {
            return res.status(403).send('Invalid or expired URL')
          }

          const data = await this.get({filePath})

          res.setHeader('Cache-Control', 'private, max-age=0')
          res.setHeader('Content-Length', data.length)

          res.send(data)
        } catch (err: any) {
          if (err.code === 'ENOENT') {
            return res.status(404).send('File not found')
          }

          console.error(err)
          res.status(500).send('Failed to read file')
        }
      },
    }
  }
}
