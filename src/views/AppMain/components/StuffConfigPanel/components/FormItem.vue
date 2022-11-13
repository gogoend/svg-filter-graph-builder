<template>
  <div v-if="schema?.showInConfigPanel !== false">
    <label>{{ fieldId }}</label>
    <br />
    <template
      v-if="schema?.type === 'text' || !schema?.type"
    >
      <select
        v-if="Array.isArray(schema?.enum)"
        is="ui-select"
        v-bind="commonInputComponentAttrs"
      >
        <option
          v-for="option in schema.enum"
          :key="(option && typeof option === 'object') ? option.value : option"
          :value="(option && typeof option === 'object') ? option.value : option"
        >{{ (option && typeof option === 'object') ? option.label : option }}</option>
      </select>
      <input
        v-else
        is="ui-input"
        type="text"
        size="20"
        v-bind="commonInputComponentAttrs"
      >
    </template>
    <template
      v-if="schema?.type === 'color'"
    >
      <input
        is="ui-color"
        type="color-opacity"
        v-bind="commonInputComponentAttrs"
      />
    </template>
    <template v-else-if="schema?.type === 'number'">
      <input
        is="ui-input"
        type="number"
        size="20"
        v-bind="commonInputComponentAttrs"
      >
    </template>
    <template v-else-if="schema?.type === 'range'">
      <input
        is="ui-range"
        type="range"
        :min="schema.range[0]"
        :max="schema.range[1]"
        :step="schema.step ?? 1"
        v-bind="commonInputComponentAttrs"
      />
    </template>
  </div>
  <!-- {{ schema }} -->
</template>
<script lang="ts" setup>
import { FOCUSING_NODE_SYMBOL } from '@/store/focusState'
// eslint-disable-next-line vue/prefer-import-from-vue
import { hasOwn } from '@vue/shared'
import { inject, unref, computed } from 'vue'

const props = defineProps({
  schema: {
    type: Object
  },
  fieldId: {
    type: String
  }
})
const fieldId = computed(() => props.fieldId!)

const [focusingNode] = inject(FOCUSING_NODE_SYMBOL)!

const feAttrValue = computed(() => {
  return unref(focusingNode)?.nodeConfigRef?.feAttrValue ?? {}
})

const foreignPortValue = computed(() => {
  return unref(focusingNode)?.nodeConfigRef?.foreignPortValue ?? {}
})

const fieldValueIsFromForeignPort = computed(() => {
  return hasOwn(unref(foreignPortValue), fieldId.value)
})

const resolveValueFromForeignPort = (foreignPortValue: string, fieldId: string) => {
  return foreignPortValue
}

const commonInputComponentAttrs = computed(() => {
  return {
    disabled: unref(fieldValueIsFromForeignPort),
    value: unref(fieldValueIsFromForeignPort) ? resolveValueFromForeignPort(foreignPortValue.value[unref(fieldId)], unref(fieldId)) : feAttrValue.value[unref(fieldId)],
    onChange: (ev: Event) => {
      ev.stopPropagation()
      feAttrValue.value[unref(fieldId)] = (ev.target as HTMLInputElement).value
    }
  }
})
</script>
<style lang="scss" scoped>
.stuff-config-panel {
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
  user-select: none;
}
</style>
