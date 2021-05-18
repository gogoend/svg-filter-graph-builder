import { Dictionary } from "@/utils/type";

export namespace SVGFilterConfig {
    type Enum = {
        label: string;
        value: string | number;
    } | string | number;

    interface NumberPort {
        type: 'number' | 'range';
        defaultValue?: number;
        enum?: Enum[];
        range?: [number, number];
    }

    interface NormalPort {
        type?: 'text' | 'hidden';
        defaultValue?: string;
        enum?: Enum[];
    }

    export type Port = NormalPort | NumberPort

    export type Node = {
        type?: 'normal' | 'merge';
        ports: Dictionary<Port>
    }
}