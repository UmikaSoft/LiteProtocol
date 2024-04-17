import { DataType } from "./dataType";

export class BufferStream {
    private innerBuffer: Buffer;
    get buffer() {
        return this.innerBuffer;
    }

    get length() {
        return this.innerBuffer.length;
    }

    constructor(buffer: Buffer = Buffer.alloc(0)) {
        this.innerBuffer = buffer;
    }

    read<T>(type: DataType<T>): T;
    read(length: number): Buffer;
    read<T>(type_or_length: DataType<T> | number): T | Buffer {
        if (typeof type_or_length === "number") {
            const value = this.innerBuffer.subarray(0, type_or_length);
            this.innerBuffer = this.innerBuffer.subarray(type_or_length);
            return value;
        } else {
            const [value, offset] = type_or_length.read(this.innerBuffer, 0);
            this.innerBuffer = this.innerBuffer.subarray(offset);
            return value;
        }
    }

    write<T>(type: DataType<T>, value: T): void;
    write(buffer: Buffer): void;
    write<T>(type_or_buffer: DataType<T> | Buffer, value?: T) {
        if (type_or_buffer instanceof Buffer) {
            this.innerBuffer = Buffer.concat([this.innerBuffer, type_or_buffer]);
        } else {
            this.innerBuffer = Buffer.concat([this.innerBuffer, type_or_buffer.write(value as T)]);
        }
    }
}
