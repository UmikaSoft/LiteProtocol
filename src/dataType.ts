export interface DataType<T> {
    write(value: T): Buffer;
    read(buffer: Buffer, offset: number): [T, number];
}
