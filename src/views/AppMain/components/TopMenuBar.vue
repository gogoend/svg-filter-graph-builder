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
                'submenu-item__active': activeMenuIndexedById[subMenu.id]
              }"
              @mouseenter="handleMouseenter(subMenu.id)"
              @mouseleave="handleMouseleave(subMenu.id)"
              @mousedown.prevent
              @click="() => {
                subMenu.onClick?.()
                activeMenuIndexedById = {}
              }"
            >{{ subMenu.label }}</li>
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
        id: 'Contact @gogoend',
        label: 'Contact @gogoend',
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
  background-color: #f4f4f4;
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
  li.submenu-item {
    list-style: none;
    min-width: 6em;
    max-width: 10em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #333;
    background-color: #eee;
    text-align: left;
    padding: 0.5em 1em;
    &__active {
      background-color: #333333;
      color: #fff;
    }
  }
}
</style>
