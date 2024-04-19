import { DataType } from "./dataType";

export abstract class BaseBufferStream {
    protected innerBuffer: Buffer;
    get buffer() {
        return this.innerBuffer;
    }

    get length() {
        return this.innerBuffer.length;
    }

    constructor(buffer: Buffer = Buffer.alloc(0)) {
        this.innerBuffer = buffer;
    }
}

export class BufferInputStream extends BaseBufferStream {
    read(length: number): Buffer {
        const value = this.innerBuffer.subarray(0, length);
        this.innerBuffer = this.innerBuffer.subarray(length);
        return value;
    }

    get<T>(type: DataType<T>): T {
        const [value, offset] = type.read(this.innerBuffer, 0);
        this.innerBuffer = this.innerBuffer.subarray(offset);
        return value;
    }
}

export class BufferOutputStream extends BaseBufferStream {
    write(buffer: Buffer) {
        this.innerBuffer = Buffer.concat([this.innerBuffer, buffer]);
    }

    put<T>(type: DataType<T>, value: T): void {
        this.innerBuffer = Buffer.concat([this.innerBuffer, type.write(value)]);
    }
}

export class BufferStream extends BaseBufferStream implements BufferInputStream, BufferOutputStream {
    read(length: number): Buffer {
        const value = this.innerBuffer.subarray(0, length);
        this.innerBuffer = this.innerBuffer.subarray(length);
        return value;
    }

    get<T>(type: DataType<T>): T {
        const [value, offset] = type.read(this.innerBuffer, 0);
        this.innerBuffer = this.innerBuffer.subarray(offset);
        return value;
    }

    write(buffer: Buffer) {
        this.innerBuffer = Buffer.concat([this.innerBuffer, buffer]);
    }

    put<T>(type: DataType<T>, value: T): void {
        this.innerBuffer = Buffer.concat([this.innerBuffer, type.write(value)]);
    }
}
