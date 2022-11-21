import Dexie from 'dexie'

const initGogoendProductsDb = async() => {
  const gogoendDb = new Dexie('gogoend')
  gogoendDb.version(1).stores({
    products: 'id,name'
  })
  return gogoendDb.table('products')
    .where('id')
    .equals(window.__sfgb_runtime_config__.name)
    .toArray()
    .then(res => {
      if (res.length === 0) {
        return gogoendDb.table('products').add(
          {
            id: window.__sfgb_runtime_config__.name,
            name: window.__sfgb_runtime_config__.name,
            version: window.__sfgb_runtime_config__.version,
            buildVersion: window.__sfgb_runtime_config__.buildVersion,
            buildHash: window.__sfgb_runtime_config__.buildHash
          }
        )
      }
    })
}

export default initGogoendProductsDb

