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
        showInConfigPanel?: false;
        showOnNode?: false
    }

    export interface NormalPort {
        type?: 'text';
        defaultValue?: string;
        enum?: Enum[];
        showInConfigPanel?: false;
        showOnNode?: false
    }

    export interface NormalNode {
        tag?: string;
        type?: 'normal';
        ports: Dictionary<Port>
    }

    export interface MergeNode {
        type: 'merge';
        ports: {
            in: {
                showInConfigPanel?: false
            }
        }
    }

    export interface SourceNode {
        type: 'source';
        ports: Record<string, never>
    }

    export interface StringLiteralNode {
        type: 'string-literal';
        ports: {
            value: {
                type: 'text'
            }
        }
    }

    export type Port = NormalPort | NumberPort
    export type Node = NormalNode | MergeNode | SourceNode | StringLiteralNode
}
