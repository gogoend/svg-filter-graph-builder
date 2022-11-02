import IoNode from '@/views/AppMain/components/SvgCanvas/components/IoNode/index.vue'

export interface Port<T> {
  vm: T;
  attr: string;
  el: SVGCircleElement | null;
}

export interface Path {
  pathDArguments: number[],
  id: string,
  from: Port<InstanceType<typeof IoNode>>,
  to: Port<InstanceType<typeof IoNode>>
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
