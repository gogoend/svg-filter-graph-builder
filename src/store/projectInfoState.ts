import packageInfo from '../../package.json'
import { uuid } from '../utils/uuid'
import { getCurrentInstance, InjectionKey, provide, ShallowRef, shallowRef, nextTick } from 'vue'
import { ALL_NODES_ON_CANVAS_SYMBOL, NODE_FORM_VALUE_TYPE_SYMBOL, LINKED_PATHS_FOR_SERIALIZE_SYMBOL, EMPTY_CANVAS_STUFF_SYMBOL } from './canvasStuff'

import LuDialog from 'lu2/theme/edge/js/common/ui/Dialog'
import { getSelectFileWaitee } from '@/components/FileChooser'
import { fileStorage, appTable } from '@/plugins/db'
import { SVG_CANVAS_VM_SYMBOL } from './vmStore'
import { ProjectFile } from '@/schema/ProjectFile'

import samples from '@/config/samples'

export const SAVE_CURRENT_PROJECT_SYMBOL: InjectionKey<() => void> = Symbol('保存项目')
export const SAVE_CURRENT_PROJECT_AS_SYMBOL: InjectionKey<() => void> = Symbol('另存为项目')

export const CURRENT_PROJECT_SYMBOL: InjectionKey<ShallowRef<ProjectFile | null>> = Symbol('已打开的项目')
export const SET_CURRENT_PROJECT_SYMBOL: InjectionKey<(project: ProjectFile | null) => void> = Symbol('设置已打开的项目')

export const CLOSE_AND_NEW_PROJECT_SYMBOL: InjectionKey<() => void> = Symbol('关闭并新建项目')

export const TRY_TO_CLOSE_CURRENT_PROJECT_SYMBOL: InjectionKey<() => void> = Symbol('关闭项目')
export const TRY_TO_SHOW_OPEN_PROJECT_DIALOG_SYMBOL: InjectionKey<() => void> = Symbol('尝试打开打开文件对话框')

export const TRY_TO_OPEN_SAMPLE_PROJECT_SYMBOL: InjectionKey<(sampleId: string) => void> = Symbol('尝试打开示例项目文件')

export default function projectInfoState() {
  const vm = getCurrentInstance()!.proxy

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const emptyCanvasStuff = (vm!.$ as any).provides[EMPTY_CANVAS_STUFF_SYMBOL]
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const svgCanvasVm = (vm!.$ as any).provides[SVG_CANVAS_VM_SYMBOL] as any

  // 没必要深度响应式
  const currentProject = shallowRef<ProjectFile | null>()
  provide(CURRENT_PROJECT_SYMBOL, currentProject)

  const setOpeningProject = (project: ProjectFile | null) => {
    currentProject.value = project
  }
  provide(SET_CURRENT_PROJECT_SYMBOL, setOpeningProject)

  const closeCurrentProject = () => {
    emptyCanvasStuff()
    setOpeningProject(null)
  }
  const tryToCloseCurrentProject = async() => {
    await new Promise((resolve, reject) => {
      new LuDialog().confirm(`<h6>ATTENTION</h6><p>Any unsaved changes will be lost. Continue?</p>`, {
        buttons: [{
          value: 'Continue',
          events(ev: any) {
            resolve(undefined)
            ev.dialog.remove()
          }
        }, {
          value: 'Cancel',
          events(ev: any) {
            reject(new Error('[关闭文件提示] 用户取消了操作'))
            ev.dialog.remove()
          }
        }]
      })
    })

    closeCurrentProject()
  }
  provide(TRY_TO_CLOSE_CURRENT_PROJECT_SYMBOL, tryToCloseCurrentProject)

  const tryToShowOpenFileDialog = async() => {
    await tryToCloseCurrentProject()
    const selectedProjectId = await getSelectFileWaitee()

    if (selectedProjectId === currentProject.value?.id) {
      return
    }

    const [projectToOpen] = await fileStorage.where({
      id: selectedProjectId
    }).toArray()

    if (!projectToOpen) {
      return Promise.reject(new Error('[打开文件弹窗] 未找到此项目，程序可能发生了内部错误'))
    }

    closeCurrentProject()

    await nextTick()

    setOpeningProject(projectToOpen)

    svgCanvasVm.value.loadCanvasStuffFromSerializedData(projectToOpen)
  }
  provide(TRY_TO_SHOW_OPEN_PROJECT_DIALOG_SYMBOL, tryToShowOpenFileDialog)

  const collectCurrentFilterProjectFileData = async(): Promise<Omit<ProjectFile, 'id'> & { id?: string }> => {
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
    const currentUserProfileId = (await appTable.get('lastUserProfileId')).value
    const project = {
      authorIds: [
        ...new Set<string>([...currentProject.value?.project.authorIds ?? [], currentUserProfileId])],
      createdTime: currentProject.value?.project.createdTime ?? Number(new Date()),
      lastModifiedTime: Number(new Date()),
      lastModifierId: currentUserProfileId,
      name: ''
    }

    const projectFileData: Omit<ProjectFile, 'id'> & { id?: string } = {
      id: currentProject.value?.id,
      stuff,
      product,
      project
    }

    // 被Proxy处理过的对象不能被结构化克隆算法克隆；但这里已经确保了相关数据被JSON序列化后再反序列化无问题
    return JSON.parse(
      JSON.stringify(projectFileData)
    )
  }
  const saveCurrentProject = async() => {
    const currentProjectId = currentProject.value?.id
    if (currentProjectId) {
      const data = await collectCurrentFilterProjectFileData()
      await fileStorage.where('id').equals(currentProjectId).modify((value, ref) => {
        // TODO: 其它数据库操作似乎不能在此运行？- 因为已经有一个事务存在了？
        ref.value = data
      })
      return
    } else {
      await saveCurrentProjectAs()
    }
  }
  provide(SAVE_CURRENT_PROJECT_SYMBOL, saveCurrentProject)

  const saveCurrentProjectAs = async() => {
    const projectFileData = await collectCurrentFilterProjectFileData()
    projectFileData.id = uuid()

    let projectName = ''
    while (projectName?.trim() === '') {
      projectName = window.prompt(
        `Enter the name of the your project`
      ) as string
    }

    if (projectName === null) {
      return Promise.reject(new Error('[projectInfoState][另存为] 用户取消保存'))
    }

    projectFileData.project.name = projectName
    const newProjectFileDataInfo = {
      id: uuid(),
      ...projectFileData
    }
    await fileStorage.add(newProjectFileDataInfo)
    // 处理 未保存的项目的情况
    setOpeningProject(newProjectFileDataInfo)
  }
  provide(SAVE_CURRENT_PROJECT_AS_SYMBOL, saveCurrentProjectAs)

  const tryToOpenSampleProject = async(sampleFileId: string) => {
    const sample = samples.find(it => it.id === sampleFileId)
    await tryToCloseCurrentProject()

    svgCanvasVm.value.loadCanvasStuffFromSerializedData(sample)
  }
  provide(TRY_TO_OPEN_SAMPLE_PROJECT_SYMBOL, tryToOpenSampleProject)
}
