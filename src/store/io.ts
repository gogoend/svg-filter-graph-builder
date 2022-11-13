import packageInfo from '../../package.json'
import { uuid } from '../utils/uuid'
import { ProjectFile } from '@/schema/ProjectFile'
import { fileStorage } from '../plugins/db'
import { getCurrentInstance, InjectionKey, provide } from 'vue'

import { ALL_NODES_ON_CANVAS_SYMBOL, NODE_FORM_VALUE_TYPE_SYMBOL, LINKED_PATHS_FOR_SERIALIZE_SYMBOL } from './canvasStuff'

export const SAVE_FILTER_SYMBOL: InjectionKey<() => void> = Symbol('保存滤镜函数')
export const GET_FILTER_FILE_FROM_DB_SYMBOL: InjectionKey<() => Promise<any[]>> = Symbol('从DB中获取已保存的滤镜的列表')

export default function io() {
  const vm = getCurrentInstance()!.proxy

  const getFilterProjectFileData = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const nodes = (vm!.$ as any).provides[ALL_NODES_ON_CANVAS_SYMBOL]
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const nodeFormValueMap = (vm!.$ as any).provides[NODE_FORM_VALUE_TYPE_SYMBOL]
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const linkedPathsForSerialize = (vm!.$ as any).provides[LINKED_PATHS_FOR_SERIALIZE_SYMBOL]

    const stuff = {
      nodes: nodes.value,
      nodeForms: nodeFormValueMap.value,
      links: linkedPathsForSerialize.value
    }
    const product = {
      name: packageInfo.name,
      version: packageInfo.version,
      buildVersion: 0
    }
    const project = {
      author: 'gogoend',
      createdTime: Number(new Date()),
      modifiedTime: Number(new Date()),
      name: ''
    }

    const projectFile: ProjectFile = {
      uuid: uuid(),
      stuff,
      product,
      project
    }

    // 被Proxy处理过的对象不能被结构化克隆算法克隆；但这里已经确保了相关数据被JSON序列化后再反序列化无问题
    return JSON.parse(
      JSON.stringify(projectFile)
    )
  }

  const saveFilter = () => {
    const projectFile = getFilterProjectFileData()

    let fileName = ''
    while (fileName?.trim() === '') {
      fileName = window.prompt(
        `请输入文件名`
      ) as string
    }

    if (fileName === null) {
      return
    }

    projectFile.product.name = fileName

    fileStorage.add({
      id: uuid(),
      ...projectFile
    })
  }
  provide(SAVE_FILTER_SYMBOL, saveFilter)

  const getFilterFileListFromDb = async() => {
    return await fileStorage.toArray()
  }
  provide(
    GET_FILTER_FILE_FROM_DB_SYMBOL,
    getFilterFileListFromDb
  )
}
