import initGogoendProductsDb from './init-gogoend-products-db'
import initCurrentProductDb from './init-product-db'
export {
  fileStorage,
  userProfileStorage,
  logsTable,
  appTable
} from './init-product-db'

export const initDb = async() => {
  await initGogoendProductsDb()
  await initCurrentProductDb()
}
