import { SVGFilterConfig } from './type'

export const feConvolveMatrix: SVGFilterConfig.Node = {
  type: 'normal',
  ports: {
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
}

export const feTurbulence: SVGFilterConfig.Node = {
  type: 'normal',
  ports: {
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
}

export const feDropShadow: SVGFilterConfig.Node = {
  type: 'normal',
  ports: {
    in: {},
    dx: {},
    dy: {},
    stdDeviation: {},
    seed: {},
    'flood-color': {},
    'flood-opacity': {}
  }
}

export const feMerge: SVGFilterConfig.Node = {
  type: 'merge',
  ports: {
    in: {
      type: 'text'
    }
  }
}

export const feOffset: SVGFilterConfig.Node = {
  type: 'normal',
  ports: {
    in: {},
    dx: {},
    dy: {}
  }
}

export const feColorMatrix: SVGFilterConfig.Node = {
  type: 'normal',
  ports: {
    in: {

    },
    type: {
      type: 'text',
      defaultValue: 'matrix',
      enum: ['matrix', 'saturate', 'hueRotate', 'luminanceToAlpha']
    },
    values: {
      defaultValue: [
        1, 0, 0, 0, 0,
        0, 1, 0, 0, 0,
        0, 0, 1, 0, 0,
        0, 0, 0, 1, 0
      ].join(' ')
    }
  }
}

export const feTile: SVGFilterConfig.Node = {
  type: 'normal',
  ports: {
    in: {}
  }
}

export const feDisplacementMap: SVGFilterConfig.Node = {
  type: 'normal',
  ports: {
    in: {},
    in2: {},
    scale: {},
    xChannelSelector: {},
    yChannelSelector: {}
  }
}

export const feImage: SVGFilterConfig.Node = {
  type: 'normal',
  ports: {
    href: {}
  }
}

export default {
  feConvolveMatrix,
  feTurbulence,
  feDropShadow,
  feMerge,
  feOffset,
  feColorMatrix,
  feTile,
  feDisplacementMap,
  feImage
}
