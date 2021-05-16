export namespace NodeConfig {
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
        type?: 'text';
        defaultValue?: string;
        enum?: Enum[];
    }

    export type Port = NormalPort | NumberPort
}