import Dexie from 'dexie'
import packageInfo from '../../package.json'

const PRODUCT_NAME = (() => {
  const packageNameSeg = packageInfo.name.split('/')
  return packageNameSeg[packageNameSeg.length - 1]
})()

const gogoendDb = new Dexie('gogoend')
gogoendDb.version(1).stores({
  products: 'id,name'
})
gogoendDb.table('products')
  .where('id')
  .equals(PRODUCT_NAME)
  .toArray()
  .then(res => {
    if (res.length === 0) {
      return gogoendDb.table('products').add(
        {
          id: PRODUCT_NAME,
          name: 'SVG滤镜节点编辑器',
          version: packageInfo.version,
          buildVersion: 1
        }
      )
    }
  })
  .catch(err => {
    console.error(err)
  })

type BizTable = {
  files: Dexie.Table<{id: string}, 'id'>
  userProfiles: Dexie.Table<{id: string}, 'id'>
}
const currentProductBb = new Dexie(PRODUCT_NAME) as unknown as Dexie & BizTable

currentProductBb.version(1).stores({
  'files': 'id',
  'userProfiles': 'id'
})

export const fileStorage = currentProductBb.table('files')
export const userProfileStorage = currentProductBb.table('userProfiles')
