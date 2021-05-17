import { NodeConfig } from './type'

export const feConvolveMatrix: Record<string, NodeConfig.Port> = {
  in: {
    type: 'hidden'
  },
  kernelMatrix: {
    defaultValue: '0 1 0, 1 1 1, 0 1 0'
  },
  order: {
    defaultValue: '3, 3'
  },
  divisor: {
    type: 'number',
    defaultValue: 1
  },
  bias: {
    type: 'number',
    range: [0, 1],
    defaultValue: 0
  },
  targetX: {
    type: 'number',
    defaultValue: 0
  },
  targetY: {
    type: 'number',
    defaultValue: 0
  },
  edgeMode: {
    type: 'text',
    defaultValue: 'none',
    enum: ['duplicate', 'wrap', 'none']
  },
  kernelUnitLength: {
    type: 'number',
    defaultValue: 2
  },
  preserveAlpha: {
    type: 'text',
    defaultValue: 'true',
    enum: ['true', 'false']
  }
}

export const feTurbulence: Record<string, NodeConfig.Port> = {
  type: {
    type: 'text',
    defaultValue: 'fractalNoise',
    enum: [
      {
        label: 'fractalNoise',
        value: 'fractalNoise'
      }, {
        label: 'turbulence',
        value: 'turbulence'
      }
    ]
  },
  baseFrequency: {
    defaultValue: '0.05'
  },
  numOctaves: {
    type: 'number',
    defaultValue: 0,
    range: [0, 100]
  },
  stitchTiles: {
    defaultValue: 'stitch',
    enum: ['stitch', 'noStitch']
  },
  seed: {
    type: 'number',
    defaultValue: 0.05
  }
}

export const feDropShadow = {
  in: {},
  dx: {},
  dy: {},
  stdDeviation: {},
  seed: {},
  'flood-color': {},
  'flood-opacity': {}
}

export const feMerge = {
  in: {}
}

const fe: Record<string, Record<string, NodeConfig.Port>> = {
  feConvolveMatrix,
  feTurbulence,
  feDropShadow,
  feMerge
}
export default fe
