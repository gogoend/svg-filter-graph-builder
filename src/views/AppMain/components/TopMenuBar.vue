<template>
  <div
    class="menu-bar"
  >
    <div
      class="menu-bar__left"
    >
      <ul class="seg-content menu-entry-list">
        <li
          v-for="menu in menuTemplate"
          :key="menu.id"
          class="menu-entry-item"
          :class="{
            'menu-entry-item__active': activeMenuIndexedById[menu.id]
          }"
          @mouseenter="handleMouseenter(menu)"
          @mouseleave="handleMouseleave(menu)"
        >
          <div>{{ menu.label }}</div>
          <ul
            class="submenu-list"
            :style="{
              position: 'absolute',
              top: `100%`,
              left: 0
            }"
            v-show="activeMenuIndexedById[menu.id]"
          >
            <li
              v-for="subMenu in menu.subMenu"
              :key="subMenu.id"
              class="submenu-item"
              :class="{
                'submenu-item--active': activeMenuIndexedById[subMenu.id],
                'submenu-item--disabled': subMenu.disabled === true,
                'submenu-item__is-hr': subMenu.type === 'hr'
              }"
              @mouseenter="handleMouseenter(subMenu)"
              @mouseleave="handleMouseleave(subMenu)"
              @mousedown.prevent
              v-pingping="{remark: `[top-menu] ${subMenu.id} 菜单项被点击`}"
              @click.prevent="() => {
                if (subMenu.disabled) { return }
                subMenu.onClick?.()
                activeMenuIndexedById = {}
              }"
            >
              <div v-if="subMenu.type === 'hr'" />
              <template v-else>
                {{ subMenu.label }}
              </template>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div
      class="menu-bar__center"
    >
      <div
        class="seg-content"
        v-pingping="{remark: `[top-menu-bar] 标题被点击`}"
      >
        {{ titleText }}
      </div>
    </div>
    <div
      class="menu-bar__right"
    >
      <div class="seg-content">
        <a
          target="_blank"
          href="https://github.com/gogoend/svg-filter-graph-builder"
          v-pingping="{remark: `[top-menu-bar] GitHub链接被点击`}"
        >GitHub</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { UNSAVED_PROJECT_NAME } from '@/config/project'
import { CURRENT_PROJECT_SYMBOL, TRY_TO_SHOW_OPEN_PROJECT_DIALOG_SYMBOL, SAVE_CURRENT_PROJECT_SYMBOL, SAVE_CURRENT_PROJECT_AS_SYMBOL, TRY_TO_CLOSE_CURRENT_PROJECT_SYMBOL } from '@/store/projectInfoState'
import { computed, inject, ref, UnwrapRef } from 'vue'
import LuLightTip from 'lu2/theme/edge/js/common/ui/LightTip'
import { showAboutDialog } from '@/components/AboutDialog'
import { PWA_BEFORE_INSTALL_WAITEE_SYMBOL, SHOW_PWA_INSTALL_DIALOG_SYMBOL } from '@/store/pwa'

const activeMenuIndexedById = ref<Record<string, true>>({})
const handleMouseenter = (menuItem: SubMenuItem) => {
  if (menuItem.disabled) { return }
  activeMenuIndexedById.value[menuItem.id] = true
}
const handleMouseleave = (menuItem: SubMenuItem) => {
  if (menuItem.disabled) { return }
  delete activeMenuIndexedById.value[menuItem.id]
}

const saveCurrentProject = inject(SAVE_CURRENT_PROJECT_SYMBOL)!
const saveCurrentProjectAs = inject(SAVE_CURRENT_PROJECT_AS_SYMBOL)!
const closeAndNewProject = inject(TRY_TO_CLOSE_CURRENT_PROJECT_SYMBOL)!
const tryToShowOpenFileDialog = inject(TRY_TO_SHOW_OPEN_PROJECT_DIALOG_SYMBOL)!

const pwaBeforeInstallWaitee = inject(PWA_BEFORE_INSTALL_WAITEE_SYMBOL)!
const showPwaInstallDialog = inject(SHOW_PWA_INSTALL_DIALOG_SYMBOL)!

type SubMenuItem = UnwrapRef<typeof menuTemplate>[number]['subMenu'][number]

const menuTemplate = computed(() => [
  {
    id: 'File',
    label: 'File',
    subMenu: [
      {
        id: 'Open',
        label: 'Open...',
        onClick() {
          tryToShowOpenFileDialog()
        }
      },
      {
        id: 'Save',
        label: 'Save',
        async onClick() {
          await saveCurrentProject()
          LuLightTip.success('Saved successfully', 'success')
        }
      },
      {
        id: 'Save As...',
        label: 'Save As...',
        async onClick() {
          await saveCurrentProjectAs()
          LuLightTip.success('Saved successfully', 'success')
        }
      },
      {
        id: 'Close',
        label: 'Close',
        onClick() {
          closeAndNewProject()
        }
      },
      {
        id: 'Hr between close and install',
        type: 'hr'
      },
      {
        id: 'Install Desktop Icon',
        label: 'Install Desktop Icon',
        // TODO: 当用户自行通过浏览器右上角自带标识安装PWA后，怎样禁用此处的安装入口？
        disabled: pwaBeforeInstallWaitee.value === null,
        async onClick() {
          showPwaInstallDialog()
        }
      }
    ]
  },
  {
    id: 'Help',
    label: 'Help',
    subMenu: [
      // {
      //   id: 'About',
      //   label: 'About'
      // },
      {
        id: 'SVG Filter specification on W3C',
        label: 'SVG Filter specification on W3C',
        onClick() {
          window.open('https://www.w3.org/TR/filter-effects-1/')
        }
      },
      {
        id: 'SVG Filter documents on MDN',
        label: 'SVG Filter documents on MDN',
        onClick() {
          window.open('https://developer.mozilla.org/en-US/docs/Web/SVG/Element/filter')
        }
      },
      {
        id: 'Hr between spec and contact',
        type: 'hr'
      },
      {
        id: 'Issue',
        label: 'Issue',
        onClick() {
          window.open('https://github.com/gogoend/svg-filter-graph-builder/issues')
        }
      },
      {
        id: 'Contact @gogoend via mail',
        label: 'Contact @gogoend via mail',
        onClick() {
          window.open('mailto:gogoend@qq.com')
        }
      },
      {
        id: 'About',
        label: 'About',
        onClick() {
          showAboutDialog()
        }
      }
    ]
  }
])

const currentProject = inject(CURRENT_PROJECT_SYMBOL)

const titleText = computed(() => {
  const textSegment = ['SVG Filter Graph Builder']

  if (currentProject?.value) {
    textSegment.unshift(currentProject.value.project.name)
  } else {
    textSegment.unshift(UNSAVED_PROJECT_NAME)
  }

  return textSegment.join(' - ')
})
</script>
<style lang="scss" scoped>
.menu-bar {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  background-color: #eee;
  user-select: none;
  > * > .seg-content {
    display: inline-flex;
    height: 100%;
    align-items: center;
  }
  &__left {
    text-align: left;
  }
  &__center {
    text-align: center;
  }
  &__right {
    text-align: right;
    > .seg-content {
      * {
        margin-right: 10px
      }
    }
  }
}
.menu-entry-list {
  margin: 0;
  padding: 0;
  text-align: center;
  li.menu-entry-item {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 4em;
    height: 100%;
    position: relative;
    &__active {
      background-color: #333333;
      color: #fff;
    }
  }
}
.submenu-list {
  margin: 0;
  padding: 0;
  // border: 1px solid #999;
  li.submenu-item {
    list-style: none;
    min-width: 8em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #333;
    background-color: #e8e8e8;
    text-align: left;
    padding: 0.5em 1em;
    &__is-hr {
      pointer-events: none;
      div {
        margin: 0;
        border: 0;
        height: 1px;
        background-color: #666;
      }
    }
    &--active {
      background-color: #333333;
      color: #fff;
    }
    &--disabled {
      color: #ccc;
    }
  }
}
</style>
