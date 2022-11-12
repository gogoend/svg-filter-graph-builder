import { EventDoer } from './utils/event-doer'
// eslint-disable-next-line vue/prefer-import-from-vue

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    globalProperties: {
      $eventHub: EventDoer
    }
 }
}
export {}
