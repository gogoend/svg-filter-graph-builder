import { ProjectFile } from '@/schema/ProjectFile'

const helloWorld: ProjectFile = {
  id: 'CAF2FD8E-77B0-4A5B-A967-C301614D0DEB',
  stuff: {
    nodes: {
      '040822F7-D416-4325-B428-8BE8433B166C': {
        is: 'feComponentTransfer',
        id: '040822F7-D416-4325-B428-8BE8433B166C',
        position: [285.00372314453125, 54.0089111328125]
      },
      '0D126B0D-841E-4193-95F1-D67412EFAD6E': {
        is: 'SourceGraphic',
        id: '0D126B0D-841E-4193-95F1-D67412EFAD6E',
        position: [30.000030517578125, 20.00787353515625]
      },
      'A432BA04-FCA6-4546-9E01-188D4125BB6B': {
        is: 'feMorphology',
        id: 'A432BA04-FCA6-4546-9E01-188D4125BB6B',
        position: [525.0057983398438, 51.008575439453125]
      },
      '6EF3BF7F-03DE-4D91-AB81-8D1B0E8F340D': {
        is: 'feFuncXUsingGamma',
        id: '6EF3BF7F-03DE-4D91-AB81-8D1B0E8F340D',
        position: [30, 104.00851440429688]
      },
      'E4B91ED1-5995-48A1-8574-F352B937FE2E': {
        is: 'feBlend',
        id: 'E4B91ED1-5995-48A1-8574-F352B937FE2E',
        position: [1026.0023193359375, 8.00787353515625]
      },
      '547A7FE0-3D96-4932-9683-0D5936C5CEF0': {
        is: 'feColorMatrixUsingMatrix',
        id: '547A7FE0-3D96-4932-9683-0D5936C5CEF0',
        position: [763, 65]
      },
      '509C12B3-D2B1-478D-9335-5697A716D24E': {
        is: 'matrixInFeColorMatrix',
        id: '509C12B3-D2B1-478D-9335-5697A716D24E',
        position: [494, 197]
      },
      'CC8C51D7-5C24-4E44-B25E-FD8A6483A77C': {
        is: 'StringLiteral',
        id: 'CC8C51D7-5C24-4E44-B25E-FD8A6483A77C',
        position: [753, 265]
      }
    },
    nodeForms: {
      '040822F7-D416-4325-B428-8BE8433B166C': {},
      'A432BA04-FCA6-4546-9E01-188D4125BB6B': {
        in: '',
        operator: 'dilate',
        radius: '5.8'
      },
      '6EF3BF7F-03DE-4D91-AB81-8D1B0E8F340D': {},
      'E4B91ED1-5995-48A1-8574-F352B937FE2E': {
        in: '',
        in2: '',
        mode: 'hard-light'
      },
      '547A7FE0-3D96-4932-9683-0D5936C5CEF0': {
        in: '',
        type: 'matrix',
        values: '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0'
      },
      '509C12B3-D2B1-478D-9335-5697A716D24E': [
        '1',
        '0',
        0,
        '0',
        0,
        '0',
        '1.1',
        '0',
        0,
        0,
        '0',
        '0',
        '1',
        '0',
        0,
        0,
        0,
        '0',
        '1',
        0
      ],
      'CC8C51D7-5C24-4E44-B25E-FD8A6483A77C': {
        value: 'hard-light'
      }
    },
    links: {
      '8FD762D2-9CBF-4272-A9AA-C2F597E218CB': {
        id: '8FD762D2-9CBF-4272-A9AA-C2F597E218CB',
        from: {
          vmId: '0D126B0D-841E-4193-95F1-D67412EFAD6E',
          attr: 'result'
        },
        to: {
          vmId: '040822F7-D416-4325-B428-8BE8433B166C',
          attr: 'in'
        }
      },
      '6A85F753-933F-43F2-87D2-B9E59159E0DE': {
        id: '6A85F753-933F-43F2-87D2-B9E59159E0DE',
        from: {
          vmId: '040822F7-D416-4325-B428-8BE8433B166C',
          attr: 'result'
        },
        to: {
          vmId: 'A432BA04-FCA6-4546-9E01-188D4125BB6B',
          attr: 'in'
        }
      },
      'B634C54D-646D-49F2-BD68-D28001BA1E72': {
        id: 'B634C54D-646D-49F2-BD68-D28001BA1E72',
        from: {
          vmId: '6EF3BF7F-03DE-4D91-AB81-8D1B0E8F340D',
          attr: 'result'
        },
        to: {
          vmId: '040822F7-D416-4325-B428-8BE8433B166C',
          attr: 'B'
        }
      },
      'AE0B9E89-5332-4B9E-A87D-70E367E93BC9': {
        id: 'AE0B9E89-5332-4B9E-A87D-70E367E93BC9',
        from: {
          vmId: '0D126B0D-841E-4193-95F1-D67412EFAD6E',
          attr: 'result'
        },
        to: {
          vmId: 'E4B91ED1-5995-48A1-8574-F352B937FE2E',
          attr: 'in'
        }
      },
      'A71F700A-465C-4358-8D6F-A6E3B4E3DA61': {
        id: 'A71F700A-465C-4358-8D6F-A6E3B4E3DA61',
        from: {
          vmId: '509C12B3-D2B1-478D-9335-5697A716D24E',
          attr: 'result'
        },
        to: {
          vmId: '547A7FE0-3D96-4932-9683-0D5936C5CEF0',
          attr: 'values'
        }
      },
      '7EAEA517-FEA0-4B18-87DE-854CBFB9EA8B': {
        id: '7EAEA517-FEA0-4B18-87DE-854CBFB9EA8B',
        from: {
          vmId: 'A432BA04-FCA6-4546-9E01-188D4125BB6B',
          attr: 'result'
        },
        to: {
          vmId: '547A7FE0-3D96-4932-9683-0D5936C5CEF0',
          attr: 'in'
        }
      },
      'A7C2B894-0422-411D-BF06-D8C9CEC45BB3': {
        id: 'A7C2B894-0422-411D-BF06-D8C9CEC45BB3',
        from: {
          vmId: '547A7FE0-3D96-4932-9683-0D5936C5CEF0',
          attr: 'result'
        },
        to: {
          vmId: 'E4B91ED1-5995-48A1-8574-F352B937FE2E',
          attr: 'in2'
        }
      },
      '1F6E3EE6-AFB7-484D-954C-22C01E1C3382': {
        id: '1F6E3EE6-AFB7-484D-954C-22C01E1C3382',
        from: {
          vmId: 'CC8C51D7-5C24-4E44-B25E-FD8A6483A77C',
          attr: 'result'
        },
        to: {
          vmId: 'E4B91ED1-5995-48A1-8574-F352B937FE2E',
          attr: 'mode'
        }
      }
    }
  },
  product: {
    name: '@gogoend/svg-filter-graph-builder',
    version: '0.1.1',
    buildVersion: 0
  },
  project: {
    authorIds: ['E5D9F285-4610-47AC-8703-6D8D12184B28'],
    createdTime: 1668689298273,
    lastModifierId: 'E5D9F285-4610-47AC-8703-6D8D12184B28',
    lastModifiedTime: 1668689298273,
    name: 'Hello World'
  }
}

const samples = [helloWorld]

export default samples
