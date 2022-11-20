import packageInfo from '../../package.json'

export const PRODUCT_NAME = (() => {
  const packageNameSeg = packageInfo.name.split('/')
  return packageNameSeg[packageNameSeg.length - 1]
})()
