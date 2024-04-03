export interface DataType<T> {
    symbol: symbol;
    write(value: T): Buffer;
    read(buffer: Buffer, offset: number): [T, number];
}
