import gogoendLog from './log'

window.addEventListener(
  'error',
  (ev: ErrorEvent) => {
    gogoendLog.error(ev.error)
    ev.preventDefault()
  }
)

window.addEventListener(
  'unhandledrejection',
  (ev: PromiseRejectionEvent) => {
    gogoendLog.error(ev.reason)
    ev.preventDefault()
  }
)
