import { InjectionKey, Ref } from 'vue'
import DemoStepItem from './components/StepItem.vue'

export const STEP_LIST_SYMBOL: InjectionKey<Ref<
  Array<InstanceType<typeof DemoStepItem>>
  // Array<any>
>> = Symbol('步骤节点vm列表')
