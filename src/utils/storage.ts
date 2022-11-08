import { isObject } from './type-check'

type StorageType = 'localStorage' | 'sessionStorage'

const set = (storageName: StorageType, key:string, value: any) => {
  if (isObject(value)) {
    try {
      value = JSON.stringify(value)
    } catch {
      void 0
    }
  }
  window[storageName].setItem(key, value)
}

const get = <T>(storageName: StorageType, key:string) => {
  let value = window[storageName].getItem(key) as any
  if (value) {
    try {
      value = JSON.parse(value)
    } catch {
      void 0
    }
  }
  return value as T
}

const remove = (storageName: StorageType, key:string) => {
  window[storageName].removeItem(key)
}

export const getLocal = <T = any>(key: string) => get<T>('localStorage', key)
export const setLocal = (key: string, value: any) => set('localStorage', key, value)
export const removeLocal = (key: string) => remove('localStorage', key)

export const getSession = <T = any>(key: string) => get<T>('sessionStorage', key)
export const setSession = (key: string, value: any) => set('sessionStorage', key, value)
export const removeSession = (key: string) => remove('sessionStorage', key)
