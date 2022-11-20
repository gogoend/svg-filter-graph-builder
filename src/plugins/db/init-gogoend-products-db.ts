import { PRODUCT_NAME } from '@/config/product'
import Dexie from 'dexie'
import packageInfo from '../../../package.json'
import gogoendLog from '../log'

export const gogoendDb = new Dexie('gogoend')
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
    gogoendLog.error(err)
  })
