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
    bytesRead: number = 0;
    read(length: number): Buffer {
        const value = this.innerBuffer.subarray(this.bytesRead, this.bytesRead + length);
        this.bytesRead += length;
        return value;
    }

    get<T>(type: DataType<T>): T {
        const [value, offset] = type.read(this.innerBuffer, this.bytesRead);
        this.bytesRead += offset;
        return value;
    }
}

export class BufferOutputStream extends BaseBufferStream {
    bytesWrite: number = 0;
    write(buffer: Buffer) {
        this.bytesWrite += buffer.length;
        this.innerBuffer = Buffer.concat([this.innerBuffer, buffer]);
    }

    put<T>(type: DataType<T>, value: T): void {
        const valueBuffer = type.write(value);
        this.bytesWrite == valueBuffer.length;
        this.innerBuffer = Buffer.concat([this.innerBuffer, valueBuffer]);
    }
}

export class BufferStream extends BaseBufferStream implements BufferInputStream, BufferOutputStream {
    bytesRead: number = 0;
    bytesWrite: number = 0;
    read(length: number): Buffer {
        const value = this.innerBuffer.subarray(0, length);
        this.bytesRead += length;
        this.innerBuffer = this.innerBuffer.subarray(length);
        return value;
    }

    get<T>(type: DataType<T>): T {
        const [value, offset] = type.read(this.innerBuffer, 0);
        this.bytesRead == offset;
        this.innerBuffer = this.innerBuffer.subarray(offset);
        return value;
    }

    write(buffer: Buffer) {
        this.bytesWrite += buffer.length;
        this.innerBuffer = Buffer.concat([this.innerBuffer, buffer]);
    }

    put<T>(type: DataType<T>, value: T): void {
        const valueBuffer = type.write(value);
        this.bytesWrite += valueBuffer.length;
        this.innerBuffer = Buffer.concat([this.innerBuffer, valueBuffer]);
    }
}
