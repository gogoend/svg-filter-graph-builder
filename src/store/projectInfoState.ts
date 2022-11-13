import { getCurrentInstance, InjectionKey, provide, ShallowRef, shallowRef, nextTick } from 'vue';

import { ProjectFile } from '../schema/ProjectFile'
import { EMPTY_CANVAS_STUFF_SYMBOL } from './canvasStuff'

export const CURRENT_PROJECT_SYMBOL: InjectionKey<ShallowRef<ProjectFile | null>> = Symbol('已打开的项目')
export const SET_CURRENT_PROJECT_SYMBOL: InjectionKey<(project: ProjectFile | null) => void> = Symbol('设置已打开的项目')
export const CLOSE_CURRENT_PROJECT_SYMBOL: InjectionKey<() => void> = Symbol('关闭项目')

export const TRY_TO_SHOW_OPEN_PROJECT_DIALOG_SYMBOL: InjectionKey<() => void> = Symbol('尝试打开打开文件对话框')

import LuDialog from 'lu2/theme/edge/js/common/ui/Dialog'
import { getSelectFileWaitee } from '@/components/FileChooser'
import { fileStorage } from '@/plugins/db'
import { SVG_CANVAS_VM_SYMBOL } from './vmStore'
import SvgCanvas from '@/views/AppMain/components/SvgCanvas/index.vue'

export default function projectInfoState() {
  const vm = getCurrentInstance()!.proxy

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const emptyCanvasStuff = (vm!.$ as any).provides[EMPTY_CANVAS_STUFF_SYMBOL]
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const svgCanvasVm = (vm!.$ as any).provides[SVG_CANVAS_VM_SYMBOL] as InstanceType<typeof SvgCanvas>

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
  provide(CLOSE_CURRENT_PROJECT_SYMBOL, closeCurrentProject)

  const tryToShowOpenFileDialog = async() => {
    if (currentProject.value) {
      await new Promise((resolve, reject) => {
        new LuDialog().confirm(`当前项目${currentProject.value?.project.name}已经打开，继续打开项目会导致对当前项目所做更改丢失。`, {
          buttons: [{
            value: '继续打开',
            events(ev: any) {
              resolve(undefined)
              ev.dialog.remove()
            }
          }, {
            events(ev: any) {
              reject(new Error('[展示打开文件弹窗] 用户取消了操作'))
              ev.dialog.remove()
            }
          }]
        })
      })
    }
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
}
