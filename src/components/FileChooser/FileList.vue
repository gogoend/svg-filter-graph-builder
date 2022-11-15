<template>
  <div
    class="file-list"
  >
    <form class="file-list__form" @submit.prevent>
      <select
        v-model="selectedValue"
        class="file-list__select"
      >
        <option
          v-for="(file, index) in fileList"
          :key="index"
          :value="file.id"
        >{{ file.project.name }}</option>
      </select>
    </form>
    <component :is="'template'" class="file-list__footer-template">
      <div class="file-list__footer">
        <button
          is="ui-button"
          :disabled="!selectedValue"
          @click.prevent="handleConfirm(selectedValue)"
        >Open</button>
        <button
          is="ui-button"
          @click.prevent="handleCancel()"
        >Cancel</button>
      </div>
    </component>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import { fileStorage } from '@/plugins/db'
import { ProjectFile } from '@/schema/ProjectFile'

defineProps({
  handleConfirm: {
    type: Function,
    required: true
  },
  handleCancel: {
    type: Function,
    required: true
  }
})

const fileList = ref<ProjectFile[]>([])
const selectedValue = ref('')

const getFilterFileListFromDb = async() => {
  return await fileStorage.toArray()
}

getFilterFileListFromDb().then((res) => {
  fileList.value = res
})
</script>
<style lang="scss" scoped>
.file-list__select {
  width: 100%;
  height: 3em;
}
.file-list__footer {
  > button + button {
    margin-left: 10px;
  }
}
</style>
