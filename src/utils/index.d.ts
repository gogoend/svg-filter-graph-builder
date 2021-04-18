export interface Dictionary<T> {
  [key: string]: T
}

export namespace MouseEventHelper {
  interface Handlers {
    start?: (ev: MouseEvent, { originEl }: { originEl: HTMLElement }) => void
    move?: (ev: MouseEvent, { originEl }: { originEl: HTMLElement }) => void
    up?: (ev: MouseEvent, { originEl }: { originEl: HTMLElement }) => void
  }
}
