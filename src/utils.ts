import { DataType } from "./dataType";

export class CacheTree {
    private map: Map<any, CacheTree> = new Map();
    public value: DataType<any> | undefined;

    addChild(key: any): CacheTree {
        const child = new CacheTree();
        this.map.set(key, child);
        return child;
    }

    getChild(key: any): CacheTree | undefined {
        return this.map.get(key);
    }

    setValue(params: Array<any>, value: DataType<any>): void {
        let node: CacheTree = this;
        for (let item of params) {
            node = node.addChild(item);
        }
        node.value = value;
    }

    getValue(params: Array<any>): DataType<any> | undefined {
        let node: CacheTree | undefined = this;
        for (let item of params) {
            node = node.getChild(item);
            if (node === undefined) return undefined;
        }
        return node.value;
    }
}

export function read<T>(type: DataType<T>, buffer: Buffer, offset: number = 0): [T, number] {
    return type.read(buffer, offset);
}

export function write<T>(type: DataType<T>, value: T): Buffer {
    return type.write(value);
}
