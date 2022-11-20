import { PRODUCT_NAME } from '@/config/product'
import { uuid } from '@/utils/uuid'
import Dexie from 'dexie'
import gogoendLog from '../log'

type BizTable = {
  files: Dexie.Table<{id: string}, 'id'>
  userProfiles: Dexie.Table<{id: string}, 'id'>
  logs: Dexie.Table<{id: number}, 'id'>,
  app: Dexie.Table
}
export const currentProductBb = new Dexie(PRODUCT_NAME) as unknown as Dexie & BizTable

currentProductBb.version(2).stores({
  'files': 'id',
  'userProfiles': 'id',
  'logs': '++id',
  'app': 'key'
})

currentProductBb.table('userProfiles')
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
  .catch(err => {
    gogoendLog.error(err)
  })

export const fileStorage = currentProductBb.table('files')
export const userProfileStorage = currentProductBb.table('userProfiles')
export const logsTable = currentProductBb.table('logs')
export const appTable = currentProductBb.table('app')
