import { LinkInStore, NodeFormValue, NodeInStore } from '@/schema/IoNode'
import { getLocal } from '@/utils/storage'

export async function getNodes(): Promise<Record<NodeInStore['id'], NodeInStore>> {
  return new Promise(resolve => {
    setTimeout(
      () => {
        resolve(
          getLocal('savedGraph')?.stuff.nodes ?? {}
        )
      },
      500
    )
  })
}

export async function getNodeValueMap(): Promise<Record<NodeInStore['id'], NodeFormValue>> {
  return new Promise(resolve => {
    setTimeout(
      () => {
        resolve(
          getLocal('savedGraph')?.stuff.nodeForms ?? {}
        )
      },
      500
    )
  })
}

export async function getLinks(): Promise<Record<LinkInStore['id'], LinkInStore>> {
  return new Promise(resolve => {
    setTimeout(
      () => {
        resolve(
          getLocal('savedGraph')?.stuff.links ?? {}
        )
      },
      500)
  })
}
