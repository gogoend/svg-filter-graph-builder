<template>
  <div
    class="file-list"
  >
    <select
      v-model="selectedValue"
    >
      <option
        v-for="(file, index) in fileList"
        :key="index"
        :value="file.id"
      >{{ file.id }}</option>
    </select>

    <button
      is="ui-button"
      :disabled="!selectedValue"
      @click.prevent="handleConfirm(selectedValue)"
    >打开</button>
    <button
      is="ui-button"
      @click.prevent="handleCancel()"
    >取消</button>
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
</style>
