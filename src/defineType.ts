import { DataType } from "./dataType";

type ReadFunc<T> = (buffer: Buffer, offset: number) => [T, number];
type WriteFunc<T> = (value: T) => Buffer;

export function defineType<T>(read_func: ReadFunc<T>, write_func: WriteFunc<T>): DataType<T> {
    const type: DataType<T> = {
        symbol: Symbol(),
        read: read_func,
        write: write_func,
    };
    return type;
}

type TypeGenerator<C extends any[], T> = (...param: C) => DataType<T>;

export function defineTypeGenerator<C extends any[], T>(
    read_func: (buffer: Buffer, offset: number, ...param: C) => [T, number],
    write_func: (value: T, ...param: C) => Buffer,
): TypeGenerator<C, T> {
    const cache = new Map<C, DataType<T>>();
    return (...param: C) => {
        let type = cache.get(param);
        console.log(cache, param, type);
        if (type) return type;
        else {
            type = defineType<T>(
                (buffer, offset) => read_func(buffer, offset, ...param),
                (value) => write_func(value, ...param),
            );
            cache.set(param, type);
            console.log(cache, param, type);
            return type;
        }
    };
}
