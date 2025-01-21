import { IExpressRouteFactory, unixTimestamp } from '@talk2resume/common'
import { HttpStatusCode } from 'axios'
import express from 'express'
import fs from 'fs'
import { DependencyContainer, injectable } from 'tsyringe'
import { UserFileEntity, UserFileRepository } from '../../../db/mongodb/repo/hero.repo'
import { createRequestScopedHandler } from '../../../ioc/scopes/request.scope'
import { ChunkedUploadHandler } from '../chunked-upload-handler'
import { UploadedFileHelper, UserFileStorageSettings } from '../uploaded-file-helper'
// export const dataMap = new Map<string, AppTreeNodeData>([
//   ['1', {
//     _id: '1',
//     text: newUUID(),
//     type: 'folder',
//   }],
//   ['2', {
//     _id: '2',
//     text: newUUID(),
//     type: 'folder',
//   }],
//   ['3', {
//     _id: '3',
//     parentKey: '1',
//     text: newUUID(),
//     type: 'file',
//   }],
//   ['4', {
//     _id: '4',
//     parentKey: '2',
//     text: newUUID(),
//     type: 'folder',
//   }],
//   ['5', {
//     _id: '5',
//     parentKey: '4',
//     text: newUUID(),
//     type: 'file',
//   }],
//   ['6', {
//     _id: '6',
//     parentKey: '4',
//     text: newUUID(),
//     type: 'file',
//   }],
// ])

@injectable()
export class UserFilesService {

  constructor(
    private settings: UserFileStorageSettings,
    private userFileRepo: UserFileRepository
  ) { }

  // find the file and delete it
  delete(id: string) {
    return this.userFileRepo
      .findById(id)
      .then(entity => {
        fs.unlink(entity?.path!, (error) => {
          if (error) {
            console.error('An error occurred:', error)
          } else {
            console.log('Successfully deleted the file.', entity?.path)
          }
        })
        return this.userFileRepo.delete(id)
      })
  }

  addFile(entity: UserFileEntity) { return this.userFileRepo.create(entity) }

  listFiles(folder?: string) {
    return this.userFileRepo
      .find({
        parentKey: folder,
        userPath: this.settings.userStorageKey
      })
      .then(entity => {
        const files = [] as any
        const folders = [] as any
        entity.sort((a, b) => a.text.localeCompare(b.text))
          .forEach(item => {
            if (item.type === 'file') {
              files.push(item)
            } else if (item.type === 'folder') {
              folders.push(item)
            }
          })

        return [...folders, ...files]
      })

  }

  move({ node, destination }: { node: string; destination: string }) {
    return this.userFileRepo
      .findById(node)
      .then(entity => {
        return this.userFileRepo.patch(node, { parentKey: destination })
      })
  }
}

@injectable()
export class UserUploadControllerRouteFactory implements IExpressRouteFactory {
  create(
    scope: DependencyContainer
  ) {

    const chunkedUploadHandler = new ChunkedUploadHandler()
    const requestScopedAction = createRequestScopedHandler(scope, (scope, req, res) => scope)

    const router = express.Router()

    router.post('/folder/:parentKey?',
      requestScopedAction<{ name: string }>(async (scope, req, res, params, body) => {
        const action = scope.resolve(UserFilesService)
        const { userStorageKey: userPath } = scope.resolve(UserFileStorageSettings)
        const parentKey = params.get('parentKey')

        await action.addFile({
          type: 'folder',
          text: body.name,
          path: '',
          userPath,
          parentKey: parentKey,
          ...unixTimestamp(),
        })

        res.status(HttpStatusCode.Created).send()
      })
    )
    router.post('/:node/move/:destination',
      requestScopedAction<{ node: string, source: string, destination: string, }>(async (scope, req, res, params, body) => {
        const action = scope.resolve(UserFilesService)
        const [node, destination] = ['node', 'destination'].map(k => params.get(k)!)

        await action.move({
          node,
          destination,
        })

        res.status(HttpStatusCode.NoContent).send()
      })
    )
    router.delete('/:id',
      requestScopedAction<{ folder: string }>(async (scope, req, res, params, body) => {
        const action = scope.resolve(UserFilesService)
        const id = params.get('id')!

        await action.delete(id)

        res.status(HttpStatusCode.NoContent).send()
      })
    )

    router.get('/list/:folder?',
      requestScopedAction<{ folder: string }>(async (scope, req, res, params, body) => {
        const action = scope.resolve(UserFilesService)
        const folderUUID = params.get('folder')
        const results = await action.listFiles(folderUUID)

        res.status(200).send(results)
      })
    )

    router.post('/upload/:folder?', chunkedUploadHandler.create(),
      requestScopedAction<{}>(async (scope, req, res, params, body) => {
        const upload = scope.resolve(UploadedFileHelper)
        const action = scope.resolve(UserFilesService)
        const { userStorageKey: userPath } = scope.resolve(UserFileStorageSettings)
        const folderUUID = params.get('folder')

        if (upload.isComplete()) {
          // const parentLink = folderUUID ? {}
          // Check if all chunks are received
          // chunks are staged in user isolated storage space
          await upload.save()
            .then(async x => {
              console.log(`File ${upload.fileName} successfully reassembled at ${upload.userFilePath}`)
              await action.addFile({
                path: upload.userFilePath,
                text: upload.fileName,
                type: 'file',
                userPath,
                parentKey: folderUUID,
                ...unixTimestamp()
              })
              res.status(200)
                .send({
                  message: 'Upload complete',
                  filePath: upload.userFilePath,
                  folder: upload.userFolder
                })
            })

        } else {
          res.status(200)
            .send({
              message: `Chunk ${upload.chunkIndex} uploaded successfully`,
            })
        }
        return
      })
    )

    return router
  }
}


