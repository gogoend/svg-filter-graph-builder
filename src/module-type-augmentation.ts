import { EventDoer } from './utils/event-doer'
import runtimeConfig from '../public/runtime-config.json'
// eslint-disable-next-line vue/prefer-import-from-vue

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    globalProperties: {
      $eventHub: EventDoer
    }
 }
}

declare global {
  interface Window{
    __sfgb_runtime_config__: typeof runtimeConfig
  }
}

export {}
