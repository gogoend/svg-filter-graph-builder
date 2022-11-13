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

    export interface ColorPort {
        type: 'color';
        defaultValue?: string;
        showInConfigPanel?: false;
        showOnNode?: false
    }

    export interface NormalNode {
        tag?: string;
        type: 'normal';
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

    export interface ComponentTransferRootNode {
        type: 'component-transfer-root'
        ports: {
            in: {
                showInConfigPanel: false
            }
            R: {
                showInConfigPanel: false
            }
            G: {
                showInConfigPanel: false
            }
            B: {
                showInConfigPanel: false
            }
            A: {
                showInConfigPanel: false
            }
        }
    }

    export type ComponentTransferChildNode = Omit<NormalNode, 'type'> & {
        type: 'component-transfer-child'
    }

    export interface MatrixInFeColorMatrixNode {
        type: 'matrix-in-fe-color-matrix';
        ports: Record<string | symbol | number, never>
    }
    export type Port = NormalPort | NumberPort | ColorPort
    export type Node = NormalNode | MergeNode | SourceNode | StringLiteralNode | MatrixInFeColorMatrixNode | ComponentTransferRootNode
}
