import { SVGFilterConfig } from './type'

export const SourceGraphic: SVGFilterConfig.Node = {
  type: 'source',
  ports: {}
}

export const SourceAlpha: SVGFilterConfig.Node = {
  type: 'source',
  ports: {}
}

export const feConvolveMatrix: SVGFilterConfig.Node = {
  type: 'normal',
  ports: {
    in: {
      showInConfigPanel: false
    },
    kernelMatrix: {
      defaultValue: '0 1 0, 1 1 1, 0 1 0'
    },
    order: {
      defaultValue: '3, 3'
    },
    divisor: {
      type: 'range',
      range: [0.01, 100],
      step: 0.01,
      defaultValue: 1
    },
    bias: {
      type: 'range',
      range: [-1, 1],
      step: 0.01,
      defaultValue: 0
    },
    targetX: {
      type: 'range',
      range: [0, 10],
      step: 1,
      defaultValue: 0
    },
    targetY: {
      type: 'range',
      range: [0, 10],
      step: 1,
      defaultValue: 0
    },
    edgeMode: {
      type: 'text',
      defaultValue: 'duplicate',
      enum: ['duplicate', 'wrap', 'none']
    },
    kernelUnitLength: {
      type: 'range',
      range: [1, 100],
      step: 1,
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
      type: 'range',
      defaultValue: 0.05,
      range: [0, 1],
      step: 0.01
    },
    numOctaves: {
      type: 'range',
      defaultValue: 1,
      step: 1,
      range: [0, 20]
    },
    stitchTiles: {
      defaultValue: 'stitch',
      enum: ['stitch', 'noStitch']
    },
    seed: {
      type: 'range',
      defaultValue: 0,
      step: 0.01,
      range: [-10000, 10000]
    }
  }
}

export const feDropShadow: SVGFilterConfig.Node = {
  type: 'normal',
  ports: {
    in: {
      showInConfigPanel: false
    },
    dx: {
      type: 'range',
      defaultValue: 0,
      step: 0.01,
      range: [-1000, 1000]
    },
    dy: {
      type: 'range',
      defaultValue: 0,
      step: 0.01,
      range: [-1000, 1000]
    },
    stdDeviation: {
      type: 'range',
      defaultValue: 0,
      step: 0.01,
      range: [0, 100]
    },
    'flood-color': {
      type: 'color'
    },
    'flood-opacity': {
      type: 'range',
      defaultValue: 1,
      step: 0.01,
      range: [0, 1]
    }
  }
}

export const feMerge: SVGFilterConfig.Node = {
  type: 'merge',
  ports: {
    in: {
      showInConfigPanel: false
    }
  }
}

export const feOffset: SVGFilterConfig.Node = {
  type: 'normal',
  ports: {
    in: {
      showInConfigPanel: false
    },
    dx: {
      type: 'range',
      defaultValue: 0,
      step: 0.01,
      range: [-1000, 1000]
    },
    dy: {
      type: 'range',
      defaultValue: 0,
      step: 0.01,
      range: [-1000, 1000]
    }
  }
}

export const feColorMatrixUsingMatrix: SVGFilterConfig.Node = {
  type: 'normal',
  tag: 'feColorMatrix',
  ports: {
    in: {
      showInConfigPanel: false
    },
    type: {
      showInConfigPanel: false,
      showOnNode: false,
      defaultValue: 'matrix'
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
export const matrixInFeColorMatrix: SVGFilterConfig.Node = {
  type: 'matrix-in-fe-color-matrix',
  ports: {}
}

export const feColorMatrixUsingSaturate: SVGFilterConfig.Node = {
  tag: 'feColorMatrix',
  type: 'normal',
  ports: {
    in: {
      showInConfigPanel: false
    },
    type: {
      showInConfigPanel: false,
      showOnNode: false,
      defaultValue: 'saturate'
    },
    values: {
      type: 'range',
      defaultValue: 1,
      step: 0.01,
      range: [-10, 10]
    }
  }
}
export const feColorMatrixUsingHueRotate: SVGFilterConfig.Node = {
  tag: 'feColorMatrix',
  type: 'normal',
  ports: {
    in: {
      showInConfigPanel: false
    },
    type: {
      showInConfigPanel: false,
      showOnNode: false,
      defaultValue: 'hueRotate'
    },
    values: {
      type: 'range',
      defaultValue: 0,
      step: 0.01,
      range: [0, 360]
    }
  }
}
export const feColorMatrixUsingLuminanceToAlpha: SVGFilterConfig.Node = {
  tag: 'feColorMatrix',
  type: 'normal',
  ports: {
    in: {
      showInConfigPanel: false
    },
    type: {
      showInConfigPanel: false,
      showOnNode: false,
      defaultValue: 'luminanceToAlpha'
    },
    values: {
    }
  }
}

export const feTile: SVGFilterConfig.Node = {
  type: 'normal',
  ports: {
    in: {
      showInConfigPanel: false
    }
  }
}

export const feDisplacementMap: SVGFilterConfig.Node = {
  type: 'normal',
  ports: {
    in: {
      showInConfigPanel: false
    },
    in2: {
      showInConfigPanel: false
    },
    scale: {
      type: 'range',
      defaultValue: 0,
      step: 0.01,
      range: [-100, 100]
    },
    xChannelSelector: {
      defaultValue: 'A',
      enum: [
        'R',
        'G',
        'B',
        'A'
      ]
    },
    yChannelSelector: {
      defaultValue: 'A',
      enum: [
        'R',
        'G',
        'B',
        'A'
      ]
    }
  }
}

export const feImage: SVGFilterConfig.Node = {
  type: 'normal',
  ports: {
    href: {}
  }
}

export const feBlend: SVGFilterConfig.Node = {
  type: 'normal',
  ports: {
    in: {
      showInConfigPanel: false
    },
    in2: {
      showInConfigPanel: false
    },
    mode: {
      defaultValue: 'normal',
      enum: [
        'normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion',
        'hue', 'saturation', 'color', 'luminosity'
      ]
    }
  }
}

export const feCompositeWithoutK: SVGFilterConfig.NormalNode = {
  type: 'normal',
  tag: 'feComposite',
  ports: {
    in: {
      showInConfigPanel: false
    },
    in2: {
      showInConfigPanel: false
    },
    operator: {
      enum: [
        'over', 'in', 'out', 'atop', 'xor', 'lighter'
      ]
    }
  }
}

export const feCompositeWithK: SVGFilterConfig.NormalNode = {
  type: 'normal',
  tag: 'feComposite',
  ports: {
    in: {
      showInConfigPanel: false
    },
    in2: {
      showInConfigPanel: false
    },
    operator: {
      showInConfigPanel: false,
      showOnNode: false,
      defaultValue: 'arithmetic'
    },
    k1: {
      type: 'range',
      range: [-5, 5],
      defaultValue: 0.5
    },
    k2: {
      type: 'range',
      range: [-5, 5],
      defaultValue: 0.5
    },
    k3: {
      type: 'range',
      range: [-5, 5],
      defaultValue: 0.5
    },
    k4: {
      type: 'range',
      range: [-5, 5],
      defaultValue: 0.5
    }
  }
}

export const feFlood: SVGFilterConfig.NormalNode = {
  type: 'normal',
  ports: {
    'flood-color': {
      type: 'color'
    },
    'flood-opacity': {
      type: 'range',
      defaultValue: 1,
      step: 0.01,
      range: [0, 1]
    }
  }
}

export const feGaussianBlur: SVGFilterConfig.NormalNode = {
  type: 'normal',
  ports: {
    in: {
      showInConfigPanel: false
    },
    stdDeviation: {
      type: 'range',
      defaultValue: 0,
      step: 0.01,
      range: [0, 100]
    },
    edgeMode: {
      type: 'text',
      enum: [
        'duplicate',
        'wrap',
        'none'
      ],
      defaultValue: 'none'
    }
  }
}

export const feMorphology: SVGFilterConfig.NormalNode = {
  type: 'normal',
  ports: {
    in: {
      showInConfigPanel: false
    },
    operator: {
      enum: [
        'erode',
        'dilate'
      ],
      defaultValue: 'erode'
    },
    radius: {
      type: 'range',
      defaultValue: 0,
      step: 0.01,
      range: [0, 50]
    }
  }
}

export const feComponentTransfer: SVGFilterConfig.ComponentTransferRootNode = {
  type: 'component-transfer-root',
  ports: {
    in: {
      showInConfigPanel: false
    },
    R: {
      showInConfigPanel: false
    },
    G: {
      showInConfigPanel: false
    },
    B: {
      showInConfigPanel: false
    },
    A: {
      showInConfigPanel: false
    }
  }
}

export const feFuncXUsingIdentity: SVGFilterConfig.ComponentTransferChildNode = {
  type: 'component-transfer-child',
  ports: {
    type: {
      defaultValue: 'identity',
      showInConfigPanel: false,
      showOnNode: false
    }
  }
}

export const feFuncXUsingTable: SVGFilterConfig.ComponentTransferChildNode = {
  type: 'component-transfer-child',
  ports: {
    type: {
      defaultValue: 'table',
      showInConfigPanel: false,
      showOnNode: false
    },
    tableValues: {
      defaultValue: '1 1 1 1'
    }
  }
}

export const feFuncXUsingLinearOrDiscrete: SVGFilterConfig.ComponentTransferChildNode = {
  type: 'component-transfer-child',
  ports: {
    type: {
      defaultValue: 'linear',
      enum: [
        'linear',
        'discrete'
      ]
    },
    slope: {
      type: 'number',
      defaultValue: 1
    },
    intercept: {
      type: 'number',
      defaultValue: 0
    }
  }
}

export const feFuncXUsingGamma: SVGFilterConfig.ComponentTransferChildNode = {
  type: 'component-transfer-child',
  ports: {
    type: {
      defaultValue: 'gamma',
      showInConfigPanel: false,
      showOnNode: false
    },
    amplitude: {
      type: 'number',
      defaultValue: 1
    },
    exponent: {
      type: 'number',
      defaultValue: 0
    },
    offset: {
      type: 'number',
      defaultValue: 0
    }
  }
}

export const StringLiteral: SVGFilterConfig.Node = {
  type: 'string-literal',
  ports: {
    value: {
      type: 'text'
    }
  }
}

export default {
  SourceGraphic,
  SourceAlpha,
  feConvolveMatrix,
  feTurbulence,
  feDropShadow,
  feMerge,
  feOffset,
  feColorMatrixUsingMatrix,
  matrixInFeColorMatrix,
  feColorMatrixUsingSaturate,
  feColorMatrixUsingHueRotate,
  feColorMatrixUsingLuminanceToAlpha,
  feTile,
  feDisplacementMap,
  feImage,
  feBlend,
  feCompositeWithoutK,
  feCompositeWithK,
  feFlood,
  feGaussianBlur,
  feMorphology,

  feComponentTransfer,
  feFuncXUsingIdentity,
  feFuncXUsingTable,
  feFuncXUsingLinearOrDiscrete,
  feFuncXUsingGamma,

  StringLiteral
}
