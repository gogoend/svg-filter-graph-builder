import { Dictionary } from '@/utils/type'

export interface Port<T extends OverwrittenIoNodeType = OverwrittenIoNodeType> {
  vm: T;
  attr: string;
  el: SVGCircleElement | null;
}

export interface Path {
  pathDArguments: number[],
  id: string,
  from: Port<OverwrittenIoNodeType>,
  to: Port<OverwrittenIoNodeType>
}

export interface Node {
  is: string;
  id: string;
  position: [number, number]
}

export interface RelativePathForNode {
  in: Path[],
  out: Path[]
}

import { VNode, ComponentPublicInstance, ShallowRef, InjectionKey } from 'vue'
import fe from './components/IoNode/fe-definition-config'
import NormalNode from './components/IoNode/components/NormalNode.vue'
import MergeNode from './components/IoNode/components/MergeNode.vue'
export interface OverwrittenIoNodeType extends ComponentPublicInstance {
  orderedAllDescendants: OverwrittenIoNodeType[];
  nodeConfigRef: InstanceType<typeof NormalNode> | InstanceType<typeof MergeNode>
  nodeId: string,
  relativePaths: RelativePathForNode,
  mergedFeAttrValue: Dictionary<string | number>,
  getVNodeFragment: (item: OverwrittenIoNodeType, index?: number) => VNode,
  is: keyof typeof fe,
  afterPathConnected?: () => void
  afterPathRemoved?: (targetPath: Path) => void
}

export const SVG_CANVAS_RECT_SYMBOL: InjectionKey<ShallowRef<DOMRectReadOnly>> = Symbol('SvgCanvas组件的范围')
