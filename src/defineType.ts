import { DataType } from "./dataType";
import { CacheTree } from "./utils";

export type ReadFunc<T> = (buffer: Buffer, offset: number) => [T, number];
export type WriteFunc<T> = (value: T) => Buffer;

export function defineType<T>(read_func: ReadFunc<T>, write_func: WriteFunc<T>): DataType<T> {
    const type: DataType<T> = {
        read: read_func,
        write: write_func,
    };
    return type;
}

export type TypeGenerator<C extends any[], T> = (...param: C) => DataType<T>;

export function defineTypeGenerator<C extends any[], T>(
    read_func: (buffer: Buffer, offset: number, ...param: C) => [T, number],
    write_func: (value: T, ...param: C) => Buffer,
): TypeGenerator<C, T> {
    const cache = new CacheTree();
    return (...param: C) => {
        const reversedParam = [...param].reverse();
        let fixedParam: C = [] as unknown as C;
        for (let [index, value] of reversedParam.entries()) {
            if (value === undefined) continue;
            fixedParam = param.slice(0, reversedParam.length - index) as C;
            break;
        }
        let type = cache.getValue(fixedParam);
        if (type) return type;
        else {
            type = defineType<T>(
                (buffer, offset) => read_func(buffer, offset, ...fixedParam),
                (value) => write_func(value, ...fixedParam),
            );
            cache.setValue(fixedParam, type);
            return type;
        }
    };
}
