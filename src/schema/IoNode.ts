export interface NodeInStore {
  is: string,
  id: string,
  position: [number, number]
}

export interface LinkInStore {
  id: string,
  from: {
    vmId: string
    attr: string
  }
  to: {
    vmId: string
    attr: string
  }
}

export type NodeFormValue = Record<string | number, string>
