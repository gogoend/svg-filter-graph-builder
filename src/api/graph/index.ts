import { LinkInStore, NodeInStore } from '@/schema/IoNode'

export async function getNodes(): Promise<Record<NodeInStore['id'], NodeInStore>> {
  return new Promise(resolve => {
    setTimeout(
      () => {
        resolve({
          '91914e37-f574-52cd-9157-bdc30073796a': { is: 'feTurbulence', id: '91914e37-f574-52cd-9157-bdc30073796a', position: [569, 462] },
          '45c3ab87-518c-5e30-89e6-910f9fa6f1dd': { is: 'feDisplacementMap', id: '45c3ab87-518c-5e30-89e6-910f9fa6f1dd', position: [671, 111] },
          'C63FCDE9-79FB-4243-90E1-D44258C8902D': { is: 'feOffset', id: 'C63FCDE9-79FB-4243-90E1-D44258C8902D', position: [1, 179] },
          '4DEDA0C9-30A4-42FC-987F-A0F968C47631': { is: 'feTile', id: '4DEDA0C9-30A4-42FC-987F-A0F968C47631', position: [86, 587] },
          '98538604-3FD4-4215-8ED9-A4B6882A9AE7': { is: 'feTurbulence', id: '98538604-3FD4-4215-8ED9-A4B6882A9AE7', position: [288, 264] },
          '3566D34B-971F-4167-8DD4-BA6A4C4A302B': { is: 'feMerge', id: '3566D34B-971F-4167-8DD4-BA6A4C4A302B', position: [273, 32] }
        })
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
            '0': {
              'id': '0',
              'from': {
                'vmId': 'C63FCDE9-79FB-4243-90E1-D44258C8902D',
                'attr': 'result'
              },
              'to': {
                'vmId': '4DEDA0C9-30A4-42FC-987F-A0F968C47631',
                'attr': 'in'
              }
            },
            '2': {
              'id': '2',
              'from': {
                'vmId': '4DEDA0C9-30A4-42FC-987F-A0F968C47631',
                'attr': 'result'
              },
              'to': {
                'vmId': '45c3ab87-518c-5e30-89e6-910f9fa6f1dd',
                'attr': 'in'
              }
            },
            '3': {
              'id': '3',
              'from': {
                'vmId': '98538604-3FD4-4215-8ED9-A4B6882A9AE7',
                'attr': 'result'
              },
              'to': {
                'vmId': '45c3ab87-518c-5e30-89e6-910f9fa6f1dd',
                'attr': 'in2'
              }
            }
          }
        )
      },
      500)
  })
}
