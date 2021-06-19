type EventHandler = (...args: any[]) => any

export class EventDoer {
  private listeners!: Record<string, EventHandler[]>

  constructor() {
    this.listeners = {}
  }

  on(type: string, callback: EventHandler) {
    if (!(type in this.listeners)) {
      this.listeners[type] = []
    }
    this.listeners[type].push(callback)
  }
  once(type: string, callback: EventHandler) {
    if (!(type in this.listeners)) {
      this.listeners[type] = []
    }
    const wrapedCallback = (...args: unknown[]) => {
      callback.call(this, ...args)
      this.off(type, wrapedCallback)
    }
    this.listeners[type].push(wrapedCallback)
  }
  off(type: string, callback: EventHandler) {
    if (!(type in this.listeners)) return
    const typeHandlers = this.listeners[type]
    if (!callback) {
      typeHandlers.length = 0
      return
    }
    for (let i = 0; i < typeHandlers.length; i++) {
      if (typeHandlers[i] === callback) {
        typeHandlers.splice(i, 1)
        return
      }
    }
  }
  emit(type: string, detail: unknown) {
    if (!(type in this.listeners)) {
      return
    }
    const typeHandlers = this.listeners[type].concat()

    for (let i = 0; i < typeHandlers.length; i++) {
      typeHandlers[i].call(this, detail)
    }
  }
  getListeners(type: string) {
    if (type) {
      return this.listeners[type]
    }
    return this.listeners
  }
}

