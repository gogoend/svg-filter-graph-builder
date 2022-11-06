import { LinkInStore, NodeInStore } from '@/schema/IoNode'

export async function getNodes(): Promise<Record<NodeInStore['id'], NodeInStore>> {
  return new Promise(resolve => {
    setTimeout(
      () => {
        resolve(
          {
            'C63FCDE9-79FB-4243-90E1-D44258C8902D': { 'is': 'feOffset', 'id': 'C63FCDE9-79FB-4243-90E1-D44258C8902D', 'position': [406.00006103515625, 175.00006103515625] },
            'CF377972-589A-40C1-ADD8-BF85A6B70D97': { 'is': 'SourceAlpha', 'id': 'CF377972-589A-40C1-ADD8-BF85A6B70D97', 'position': [238, 57] },
            '5EC6CD3D-E50E-4BD9-B732-53B885A77FA3': { 'is': 'StringLiteral', 'id': '5EC6CD3D-E50E-4BD9-B732-53B885A77FA3', 'position': [-47, 290] },
            'D86EB3F2-AF69-4F6B-85AA-46DA42F68F90': { 'is': 'feMerge', 'id': 'D86EB3F2-AF69-4F6B-85AA-46DA42F68F90', 'position': [409, 467] }
          }
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
          {
            '81EF70DA-EAD8-400C-B28C-81AF36302FB8': { 'id': '81EF70DA-EAD8-400C-B28C-81AF36302FB8', 'from': { 'vmId': 'CF377972-589A-40C1-ADD8-BF85A6B70D97', 'attr': 'result' }, 'to': { 'vmId': 'C63FCDE9-79FB-4243-90E1-D44258C8902D', 'attr': 'in' }},
            '24BB2B85-5C77-4493-93E1-8BFC569141C4': { 'id': '24BB2B85-5C77-4493-93E1-8BFC569141C4', 'from': { 'vmId': '5EC6CD3D-E50E-4BD9-B732-53B885A77FA3', 'attr': 'result' }, 'to': { 'vmId': 'C63FCDE9-79FB-4243-90E1-D44258C8902D', 'attr': 'dx' }},
            'F7BD8DC4-4684-4023-BF6B-D47844B1F3F9': { 'id': 'F7BD8DC4-4684-4023-BF6B-D47844B1F3F9', 'from': { 'vmId': '5EC6CD3D-E50E-4BD9-B732-53B885A77FA3', 'attr': 'result' }, 'to': { 'vmId': 'C63FCDE9-79FB-4243-90E1-D44258C8902D', 'attr': 'dy' }},
            'B8EAFE16-E88D-4D72-BAB4-4A195E18C944': { 'id': 'B8EAFE16-E88D-4D72-BAB4-4A195E18C944', 'from': { 'vmId': 'C63FCDE9-79FB-4243-90E1-D44258C8902D', 'attr': 'result' }, 'to': { 'vmId': 'D86EB3F2-AF69-4F6B-85AA-46DA42F68F90', 'attr': '0' }}
          }
        )
      },
      500)
  })
}
