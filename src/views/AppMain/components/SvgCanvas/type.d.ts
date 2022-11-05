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

import { VNode, ComponentPublicInstance } from 'vue'
import fe from './components/IoNode/fe-definition-config'
export interface OverwrittenIoNodeType extends ComponentPublicInstance {
  nodeId: string,
  relativePaths: RelativePathForNode,
  mergedFeAttrValue: Dictionary<string | number>,
  getVNodeFragment: (item: OverwrittenIoNodeType, index: number) => VNode,
  is: keyof typeof fe,
  afterConnected?: () => void
}
