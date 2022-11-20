<template>
  <div
    class="output-preview-panel"
    :ref="outputPreviewPanelRootEl"
  >
    <div class="output-preview-panel__menu-bar">
      <div class="output-preview-panel__menu-bar__left-content">
        <div
          class="output-preview-panel__drag-move-handler"
          v-move
        >
          <el-icon
            :size="24"
            color="#fff"><Rank /></el-icon>
        </div>
        <span class="output-preview-panel__menu-bar-text">Preview</span>
      </div>
      <div class="output-preview-panel__menu-bar__right-content">
        <button
          class="lu-ui__extend-small"
          is="ui-button"
          @click="saveFilteredImage"
        >
          Save as PNG
        </button>
      </div>
    </div>
    <div
      class="output-preview-panel__content"
      ref="filteredContentEl"
    >
      <filter-def
        filter-el-id="previewingFilter"
      />
      <div
        class="output-preview-panel__image-wrap"
        @dragstart.stop.prevent
        @dragover.stop.prevent="dragIsHovering = true"
        @dragleave.stop.prevent="dragIsHovering = false"
        @drop.stop.prevent="handleDropOnImageWrap"
      >
        <img
          class="output-preview-panel__image"
          v-if="sourceImageSrc"
          :src="sourceImageSrc"
          @error="sourceImageSrc = ''"
          ref="sourceImageEl"
        />
        <div
          class="output-preview-panel__image-placeholder"
          v-else
        >
          <div>
            Drop your image here, then use it as the source image.<br />
            You can also
            <input
              ref="fileInputEl"
              type="file"
              :style="{
                display: 'block',
                opacity: 0,
                position: 'fixed',
                visibility: 'hidden'
              }"
              @change="handleFileInputChange"
            />
            <button
              class="lu-ui__extend-small"
              is="ui-button"
              data-type="primary"
              @click="() => { fileInputEl.click() }"
            >choose a image</button>,
            <button
              class="lu-ui__extend-small"
              is="ui-button"
              data-type="primary"
              @click="showImageUrlInputDialog"
            >enter the url of the image</button>
            &nbsp;or&nbsp;
            <button
              class="lu-ui__extend-small"
              is="ui-button"
              data-type="primary"
              @click="loadSampleImage"
            >use sample image</button>.
          </div>
        </div>
        <div
          class="output-preview-panel__image__drag-is-hovering__tip"
          v-show="dragIsHovering"></div>
      </div>
      <div class="output-preview-panel__tools">
        <!--  -->
      </div>
    </div>
    <div
      class="output-preview-panel__se-resize-corner"
      v-resize
    ></div>
  </div>
</template>
<script lang="ts">
import { defineComponent, nextTick, onUnmounted, ref, shallowRef, unref, watch } from 'vue'
import FilterDef from './components/FilterDef.vue'
import mouseEventHelper from '@/utils/mouse-event-helper'

import domtoimage from 'dom-to-image'
import LuLightTip from 'lu2/theme/edge/js/common/ui/LightTip'
import log from '@/plugins/log'

export default defineComponent({
  name: 'OutputPreviewPanel',
  components: { FilterDef },
  directives: {
    move: {
      mounted(el) {
        el.__vDragMainElToBeDragged__ = document.querySelector('.output-preview-panel')
        const mouseStartHandler = (ev: MouseEvent) => mouseEventHelper(
          ev,
          {
            start(ev) {
              // 鼠标按下，记下此时坐标相对于当前元素的坐标
              // TODO: 或许应当是鼠标相对要被拖动的元素的坐标。此处当前元素恰好在要被拖动的元素的左上方
              // TODO: 最好实现一个通用版本的指令，以便复用
              /**
               * -------------------------
               * |       ^               |
               * |       |               |
               * |<------*               |
               * |        (x, y)         |
               * |                       |
               * -------------------------
               */
              const currentPosition = (el.getBoundingClientRect() as DOMRect)
              el.__vDragClickedRelativePosition__ = [
                ev.pageX - currentPosition?.left,
                ev.pageY - currentPosition?.top
              ]
            },
            move(ev) {
              // 鼠标移动，使用屏幕坐标减去按下时保存的相对坐标，再移动，即可得到正确的位置
              // 此时相对坐标不要重新算，因为鼠标移动距离与mousemove的触发时机没有关系
              const newPosition = [
                ev.pageX - el.__vDragClickedRelativePosition__[0],
                ev.pageY - el.__vDragClickedRelativePosition__[1]
              ]
              el.__vDragMainElToBeDragged__.style.left = newPosition[0] + 'px'
              el.__vDragMainElToBeDragged__.style.top = newPosition[1] + 'px'
              checkAndCorrectPosition()
            },
            up() {
              checkAndCorrectPosition()
              delete el.__vDragClickedRelativePosition__
            }
          }
        )

        function checkAndCorrectPosition() {
          // 鼠标抬起时，判断元素是否位于浮动窗口可视区域内。如果在可视区域外，将移回可视区域内
          const mainElToBeDraggedRect = (el.__vDragMainElToBeDragged__! as HTMLElement).getBoundingClientRect()

          if (mainElToBeDraggedRect.x <= 0) {
                el.__vDragMainElToBeDragged__!.style.left = `0px`
          } else if (mainElToBeDraggedRect.x + mainElToBeDraggedRect.width > window.innerWidth) {
                el.__vDragMainElToBeDragged__!.style.left = `${window.innerWidth - mainElToBeDraggedRect.width}px`
          }

          if (mainElToBeDraggedRect.y <= 0) {
                el.__vDragMainElToBeDragged__!.style.top = `0px`
          } else if (mainElToBeDraggedRect.y + mainElToBeDraggedRect.height > window.innerHeight) {
                el.__vDragMainElToBeDragged__!.style.top = `${window.innerHeight - mainElToBeDraggedRect.height}px`
          }
        }

        window.addEventListener(
          'resize',
          checkAndCorrectPosition
        )

        el.addEventListener(
          'mousedown',
          mouseStartHandler
        )
        el.__vDragDispose__ = () => {
          delete el.__vDragDispose__
          delete el.__vDragMainElToBeDragged__
          el.removeEventListener(
            'mousedown',
            mouseStartHandler
          )
          window.removeEventListener(
            'resize',
            checkAndCorrectPosition
          )
        }
      },
      unmounted(el) {
        el.__vDragDispose__()
      }
    },
    resize: {
      mounted(el) {
        el.__vResizeMainElToBeResized__ = document.querySelector('.output-preview-panel')
        const mouseStartHandler = (ev: MouseEvent) => mouseEventHelper(
          ev,
          {
            move(ev) {
              const currentRect = (el.__vResizeMainElToBeResized__.getBoundingClientRect() as DOMRect)
              const newSize = [
                ev.pageX - currentRect.x,
                ev.pageY - currentRect.y
              ]
              if (
                currentRect.x + newSize[0] >= window.innerWidth
              ) {
                newSize[0] -= (ev.pageX - window.innerWidth)
              }
              if (
                currentRect.y + newSize[1] > window.innerHeight
              ) {
                newSize[1] -= (ev.pageY - window.innerHeight)
              }
              if (currentRect.width >= window.innerWidth) {
                newSize[0] = window.innerWidth
              }
              if (currentRect.height >= window.innerHeight) {
                newSize[1] = window.innerWidth
              }

              el.__vResizeMainElToBeResized__.style.width = newSize[0] + 'px'
              el.__vResizeMainElToBeResized__.style.height = newSize[1] + 'px'
            }
          }
        )

        el.addEventListener(
          'mousedown',
          mouseStartHandler
        )
        el.__vResizeDispose__ = () => {
          delete el.__vResizeDispose__
          delete el.__vResizeMainElToBeResized__
          el.removeEventListener(
            'mousedown',
            mouseStartHandler
          )
        }
      },
      unmounted(el) {
        el.__vResizeDispose__()
      }
    }
  },
  setup() {
    const sourceImageSrc = ref()
    watch(sourceImageSrc, (nVal, oVal) => {
      URL.revokeObjectURL(oVal)
    })
    onUnmounted(() => {
      URL.revokeObjectURL(unref(sourceImageSrc))
    })
    const loadSampleImage = () => {
      sourceImageSrc.value = './demo/assets/rinkysplash.jpg'
    }

    const outputPreviewPanelRootEl = ref()
    const dragIsHovering = ref(false)
    const handleDropOnImageWrap = (ev: DragEvent) => {
      dragIsHovering.value = false
      const newImageFile = ev.dataTransfer?.files[0]
      if (!newImageFile) {
        return
      }
      sourceImageSrc.value = URL.createObjectURL(newImageFile)
    }

    const fileInputEl = shallowRef<HTMLInputElement>()
    const handleFileInputChange = (ev: Event) => {
      const newImageFile = (ev.target as HTMLInputElement).files?.[0]
      if (!newImageFile) {
        return
      }
      sourceImageSrc.value = URL.createObjectURL(newImageFile)
    }
    const showImageUrlInputDialog = () => {
      let url: string | null = ''
      while (url?.trim() === '') {
        url = window.prompt(
          'Enter the url of the your image'
        ) as string
      }
      if (url === null) {
        return Promise.reject(new Error('[output-preview-panel][输入图片url] 用户取消输入'))
      }

      sourceImageSrc.value = url
    }

    const filteredContentEl = ref<HTMLElement>()
    const sourceImageEl = shallowRef<HTMLImageElement>()
    const saveFilteredImage = async() => {
      try {
        const clonedContentNode = filteredContentEl.value!.cloneNode(true)! as HTMLElement
        const imageEl = clonedContentNode.querySelector('.output-preview-panel__image')! as HTMLImageElement

        if (!imageEl) {
          LuLightTip.error('没有可以导出的图片，请在预览面板中拖入一张图片，或使用示例图片')
          return
        }

        await new Promise((resolve, reject) => {
          imageEl.addEventListener(
            'load',
            resolve,
            {
              once: true
            }
          )
          imageEl.addEventListener(
            'error',
            reject,
            {
              once: true
            }
          )
        })

        imageEl.style.minWidth = imageEl.naturalWidth + 'px'
        imageEl.style.minHeight = imageEl.naturalHeight + 'px'

        const tempWrapperElForSnapshot = document.createElement('div')
        tempWrapperElForSnapshot.append(clonedContentNode)
        Object.assign(
          tempWrapperElForSnapshot.style,
          {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            width: 0,
            height: 0,
            overflow: 'hidden'
          }
        )
        document.body.append(tempWrapperElForSnapshot)

        let dataUrl = ''
        try {
          dataUrl = await domtoimage.toPng(
            clonedContentNode
          )
        } catch (err) {
          log.log('[output-preview-panel][生成图片]', sourceImageSrc.value)
          log.error('[output-preview-panel][生成图片] 生成图片过程发生错误，请稍后重试', err)
          throw err
        } finally {
          tempWrapperElForSnapshot.remove()
        }

        const decodedData = atob((() => {
          const urlSegs = dataUrl.split(',')
          return urlSegs[urlSegs.length - 1]
        })())

        const uint8Arr = new Uint8Array(decodedData.length)
        for (let i = 0; i < uint8Arr.length; i++) {
          uint8Arr[i] = decodedData.charCodeAt(i)
        }

        const blob = new Blob([uint8Arr], { type: 'image/png' })
        const url = URL.createObjectURL(blob)
        window.open(
          url,
          '_blank'
        )
      } catch (err) {
        LuLightTip.error('生成图片过程发生错误，请稍后重试')
      }
    }

    return {
      sourceImageSrc,
      loadSampleImage,
      outputPreviewPanelRootEl,

      dragIsHovering,
      handleDropOnImageWrap,

      showImageUrlInputDialog,

      fileInputEl,
      handleFileInputChange,

      sourceImageEl,
      filteredContentEl,
      saveFilteredImage
    }
  }
})
</script>
<style lang="scss" scoped>
@keyframes inset-shadow-shining__output-preview-panel__image__drag-is-hovering__tip {
  0% {
    box-shadow: 0 400px 50px inset rgba(0,0,0,0.5)
  }
  100% {
    box-shadow: 0 400px 50px inset rgba(0,0,0,0)
  }
}
.output-preview-panel {
  --menu-bar-height: 24px;
  min-height: var(--menu-bar-height);
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
  position: relative;
  display: flex;
  flex-direction: column;
  z-index: 1;
  user-select: none;
  &__menu-bar {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: var(--menu-bar-height);
    background-color: #fbfbfb;
    z-index: 1;
  }
  &__menu-bar__left-content {
    display: flex;
  }
  &__menu-bar__right-content {
    display: flex;
  }
  &__menu-bar-text {
    line-height: var(--menu-bar-height);
    margin-left: 0.5em;
  }
  &__drag-move-handler {
    background-color: #202020;
    width: var(--menu-bar-height);
    height: var(--menu-bar-height);
    cursor: move;
  }
  &__content {
    flex: 1 1 auto;
    position: relative;
  }
  &__image-wrap {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: url(#previewingFilter)
  }
  &__image-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    filter: url(#previewingFilter);
    overflow: hidden;
  }
  &__image__drag-is-hovering__tip {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    pointer-events: none;
    animation: inset-shadow-shining__output-preview-panel__image__drag-is-hovering__tip 0.25s ease 0s infinite alternate;
  }
  &__tools {
    position: relative;
  }
  &__se-resize-corner {
    position: absolute;
    right: 0px;
    bottom: 0px;
    box-sizing: border-box;
    width: var(--menu-bar-height);
    height: var(--menu-bar-height);
    border-right: 4px solid #59ad3a;
    border-bottom: 4px solid #59ad3a;
    cursor: se-resize;
    z-index: 1;
  }
}
</style>
