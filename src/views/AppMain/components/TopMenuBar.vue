<template>
  <div
    class="menu-bar"
  >
    <div
      :style="{
        textAlign: 'left'
      }"
    >
      <ul class="seg-content menu-entry-list">
        <li
          v-for="menu in menuTemplate"
          :key="menu.id"
          class="menu-entry-item"
          :class="{
            'menu-entry-item__active': activeMenuIndexedById[menu.id]
          }"
          @mouseenter="handleMouseenter(menu.id)"
          @mouseleave="handleMouseleave(menu.id)"
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
                'submenu-item__is-hr': subMenu.type === 'hr'
              }"
              @mouseenter="handleMouseenter(subMenu.id)"
              @mouseleave="handleMouseleave(subMenu.id)"
              @mousedown.prevent
              @click.prevent="() => {
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
      :style="{
        textAlign: 'center'
      }"
    >
      <div class="seg-content">
        SVG Filter Graph Builder
      </div>
    </div>
    <div
      :style="{
        textAlign: 'right'
      }"
    >
      <div class="seg-content">
        <a
          target="_blank"
          href="https://github.com/gogoend/svg-filter-graph-builder"
        >GitHub</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SAVE_FILTER_SYMBOL } from '@/store/canvasStuff'
import { computed, inject, ref } from 'vue'

const activeMenuIndexedById = ref<Record<string, true>>({})
const handleMouseenter = (id: string) => {
  activeMenuIndexedById.value[id] = true
}
const handleMouseleave = (id: string) => {
  delete activeMenuIndexedById.value[id]
}

const saveFilter = inject(SAVE_FILTER_SYMBOL)!

const menuTemplate = computed(() => [
  {
    id: 'File',
    label: 'File',
    subMenu: [
      // {
      //   id: 'Open',
      //   label: 'Open...'
      // },
      {
        id: 'Save',
        label: 'Save',
        onClick() {
          saveFilter()
        }
      }
      // {
      //   id: 'Save As',
      //   label: 'Save As'
      // },
      // {
      //   id: 'Close',
      //   label: 'Close'
      // }
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
      }
    ]
  }
])
</script>
<style lang="scss" scoped>
.menu-bar {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  background-color: #eee;
  .seg-content {
    display: inline-flex;
    height: 100%;
    align-items: center;
  }
}
.menu-entry-list {
  margin: 0;
  padding: 0;
  text-align: center;
  user-select: none;
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
  }
}
</style>