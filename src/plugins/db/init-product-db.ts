import { ProjectFile } from '@/schema/ProjectFile'
import { uuid } from '@/utils/uuid'
import Dexie from 'dexie'

type BizTable = {
  files: Dexie.Table<ProjectFile, 'id'>
  userProfiles: Dexie.Table<{id: string}, 'id'>
  logs: Dexie.Table,
  app: Dexie.Table
}

export let fileStorage: BizTable['files']
export let userProfileStorage: BizTable['userProfiles']
export let logsTable: BizTable['logs']
export let appTable: BizTable['app']

const initCurrentProductDb = async() => {
  const currentProductBb = new Dexie(window.__sfgb_runtime_config__.name) as unknown as Dexie & BizTable
  currentProductBb.version(2).stores({
    'files': 'id',
    'userProfiles': 'id',
    'logs': '++id',
    'app': 'key'
  })

  await currentProductBb.table('userProfiles')
    .toArray()
    .then(res => {
      if (res.length === 0) {
        return currentProductBb.table('userProfiles').add(
          {
            id: uuid(),
            name: 'Default User',
            createdTime: Number(new Date()),
            lastModifiedTime: Number(new Date())
          }
        )
      }
    })
    .then(() => {
      return currentProductBb.table('app').get('lastUserProfileId')
    })
    .then((res) => {
      if (!res) {
        return currentProductBb.table('userProfiles').toCollection().first()
      } else {
        return currentProductBb.table('userProfiles').get(res.value)
      }
    })
    .then((res) => {
      return currentProductBb.table('app').put({
        key: 'lastUserProfileId',
        value: res.id
      }, ['key'])
    })

  fileStorage = currentProductBb.table('files')
  userProfileStorage = currentProductBb.table('userProfiles')
  logsTable = currentProductBb.table('logs')
  appTable = currentProductBb.table('app')
}

export default initCurrentProductDb
