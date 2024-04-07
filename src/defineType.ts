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

type TypeGenerator<C, T> = (param: C) => DataType<T>;

export function defineTypeGenerator<C, T>(
    read_func: (param: C, buffer: Buffer, offset: number) => [T, number],
    write_func: (param: C, value: T) => Buffer,
): TypeGenerator<C, T> {
    return (param: C) => {
        const cache = new Map<C, DataType<T>>();
        let type = cache.get(param);
        return type
            ? type
            : defineType<T>(
                  (buffer, offset) => read_func(param, buffer, offset),
                  (value) => write_func(param, value),
              );
    };
}
