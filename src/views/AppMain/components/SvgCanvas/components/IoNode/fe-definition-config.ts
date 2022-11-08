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
      defaultValue: 'duplicate',
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
      type: 'number',
      defaultValue: 0.05
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
    in: {
      showInConfigPanel: false
    },
    dx: {
      type: 'number'
    },
    dy: {
      type: 'number'
    },
    stdDeviation: {
      type: 'number'
    },
    seed: {},
    'flood-color': {},
    'flood-opacity': {}
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
      type: 'number'
    },
    dy: {
      type: 'number'
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
      defaultValue: '1'
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
      defaultValue: '0'
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
      type: 'number',
      defaultValue: 0.5
    },
    k2: {
      type: 'number',
      defaultValue: 0.5
    },
    k3: {
      type: 'number',
      defaultValue: 0.5
    },
    k4: {
      type: 'number',
      defaultValue: 0.5
    }
  }
}

export const feFlood: SVGFilterConfig.NormalNode = {
  type: 'normal',
  ports: {
    'flood-color': {
    },
    'flood-opacity': {
      type: 'number'
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
      type: 'number'
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

  StringLiteral
}
