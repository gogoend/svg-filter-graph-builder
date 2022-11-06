import { Dictionary } from '@/utils/type'

type Enum = {
    label: string;
    value: string | number;
} | string | number;

export namespace SVGFilterConfig {
    export interface NumberPort {
        type: 'number' | 'range';
        defaultValue?: number;
        enum?: Enum[];
        range?: [number, number];
    }

    export interface NormalPort {
        type?: 'text' | 'hidden';
        defaultValue?: string;
        enum?: Enum[];
    }

    export interface NormalNode {
        type?: 'normal';
        ports: Dictionary<Port>
    }

    export interface MergeNode {
        type: 'merge';
        ports: {
            in: {
                type: 'hidden'
            }
        }
    }

    export interface SourceNode {
        type: 'source';
        ports: Record<string, never>
    }

    export type Port = NormalPort | NumberPort
    export type Node = NormalNode | MergeNode | SourceNode
}
