import assert from "assert";
import { DataType } from "./dataType";
import { FLStringLengthException } from "./exception/FLStringLengthException";
import { FLArrayLengthException } from "./exception/FLArrayLengthException";

export namespace Types {
    // Int8
    export const Int8: DataType<number> = {
        write: function (value: number): Buffer {
            assert(Number.isInteger(value), new TypeError("Int8 type requires input of integer"));
            const buffer = Buffer.alloc(1);
            buffer.writeInt8(value);
            return buffer;
        },
        read: function (buffer: Buffer, offset: number): [number, number] {
            return [buffer.readInt8(offset), 1];
        },
        symbol: Symbol(),
    };

    // UInt8

    export const UInt8: DataType<number> = {
        write: function (value: number): Buffer {
            assert(Number.isInteger(value), new TypeError("UInt8 type requires input of integer"));
            const buffer = Buffer.alloc(1);
            buffer.writeUInt8(value);
            return buffer;
        },
        read: function (buffer: Buffer, offset: number): [number, number] {
            return [buffer.readUInt8(offset), 1];
        },
        symbol: Symbol(),
    };

    // Int32

    export const Int32: DataType<number> = {
        write: function (value: number): Buffer {
            assert(Number.isInteger(value), new TypeError("Int32 type requires input of integer"));
            const buffer = Buffer.alloc(4);
            buffer.writeInt32BE(value);
            return buffer;
        },
        read: function (buffer: Buffer, offset: number): [number, number] {
            return [buffer.readInt32BE(offset), 4];
        },
        symbol: Symbol(),
    };

    export const Int32LE: DataType<number> = {
        write: function (value: number): Buffer {
            assert(Number.isInteger(value), new TypeError("Int32LE type requires input of integer"));
            const buffer = Buffer.alloc(4);
            buffer.writeInt32LE(value);
            return buffer;
        },
        read: function (buffer: Buffer, offset: number): [number, number] {
            return [buffer.readInt32LE(offset), 4];
        },
        symbol: Symbol(),
    };

    // UInt32

    export const UInt32: DataType<number> = {
        write: function (value: number): Buffer {
            assert(Number.isInteger(value), new TypeError("UInt32 type requires input of integer"));
            const buffer = Buffer.alloc(4);
            buffer.writeUInt32BE(value);
            return buffer;
        },
        read: function (buffer: Buffer, offset: number): [number, number] {
            return [buffer.readUInt32BE(offset), 4];
        },
        symbol: Symbol(),
    };

    export const UInt32LE: DataType<number> = {
        write: function (value: number): Buffer {
            assert(Number.isInteger(value), new TypeError("UInt32LE type requires input of integer"));
            const buffer = Buffer.alloc(4);
            buffer.writeUInt32LE(value);
            return buffer;
        },
        read: function (buffer: Buffer, offset: number): [number, number] {
            return [buffer.readUInt32LE(offset), 4];
        },
        symbol: Symbol(),
    };

    // Int64

    export const Int64: DataType<bigint> = {
        write: function (value: bigint | number): Buffer {
            const buffer = Buffer.alloc(8);
            buffer.writeBigInt64BE(BigInt(value));
            return buffer;
        },
        read: function (buffer: Buffer, offset: number): [bigint, number] {
            return [buffer.readBigInt64BE(offset), 8];
        },
        symbol: Symbol(),
    };

    export const Int64LE: DataType<bigint> = {
        write: function (value: bigint | number): Buffer {
            const buffer = Buffer.alloc(8);
            buffer.writeBigInt64LE(BigInt(value));
            return buffer;
        },
        read: function (buffer: Buffer, offset: number): [bigint, number] {
            return [buffer.readBigInt64LE(offset), 8];
        },
        symbol: Symbol(),
    };

    // UInt64

    export const UInt64: DataType<bigint> = {
        write: function (value: bigint | number): Buffer {
            const buffer = Buffer.alloc(8);
            buffer.writeBigUInt64BE(BigInt(value));
            return buffer;
        },
        read: function (buffer: Buffer, offset: number): [bigint, number] {
            return [buffer.readBigUInt64BE(offset), 8];
        },
        symbol: Symbol(),
    };

    export const UInt64LE: DataType<bigint> = {
        write: function (value: bigint | number): Buffer {
            const buffer = Buffer.alloc(8);
            buffer.writeBigUInt64LE(BigInt(value));
            return buffer;
        },
        read: function (buffer: Buffer, offset: number): [bigint, number] {
            return [buffer.readBigUInt64LE(offset), 8];
        },
        symbol: Symbol(),
    };

    // Float

    export const Float: DataType<number> = {
        write: function (value: number): Buffer {
            const buffer = Buffer.alloc(4);
            buffer.writeFloatBE(value);
            return buffer;
        },
        read: function (buffer: Buffer, offset: number): [number, number] {
            return [buffer.readFloatBE(offset), 4];
        },
        symbol: Symbol(),
    };

    export const FloatLE: DataType<number> = {
        write: function (value: number): Buffer {
            const buffer = Buffer.alloc(4);
            buffer.writeFloatLE(value);
            return buffer;
        },
        read: function (buffer: Buffer, offset: number): [number, number] {
            return [buffer.readFloatLE(offset), 4];
        },
        symbol: Symbol(),
    };

    // Double

    export const Double: DataType<number> = {
        write: function (value: number): Buffer {
            const buffer = Buffer.alloc(8);
            buffer.writeDoubleBE(value);
            return buffer;
        },
        read: function (buffer: Buffer, offset: number): [number, number] {
            return [buffer.readDoubleBE(offset), 8];
        },
        symbol: Symbol(),
    };

    export const DoubleLE: DataType<number> = {
        write: function (value: number): Buffer {
            const buffer = Buffer.alloc(8);
            buffer.writeDoubleLE(value);
            return buffer;
        },
        read: function (buffer: Buffer, offset: number): [number, number] {
            return [buffer.readDoubleLE(offset), 8];
        },
        symbol: Symbol(),
    };

    // FLArray

    const FLArrayCache: Record<symbol, Record<number, DataType<any>>> = {};

    export function FLArray<T>(item_type: DataType<T>, length: number): DataType<ArrayLike<T> & Iterable<T>>;

    export function FLArray<T>(item_type: DataType<T>, length: number): DataType<ArrayLike<T> & Iterable<T>> {
        let cachedType;
        if (FLArrayCache[item_type.symbol] && (cachedType = FLArrayCache[item_type.symbol][length])) return cachedType;

        const type: DataType<ArrayLike<T> & Iterable<T>> = {
            write: function (value: ArrayLike<T> & Iterable<T>): Buffer {
                const result = [];

                if (value.length != length) throw new FLArrayLengthException(length, value.length);
                for (let item of value) result.push(item_type.write(item));
                return Buffer.concat(result);
            },
            read: function (buffer: Buffer, offset: number): [ArrayLike<T> & Iterable<T>, number] {
                const result = [];
                let array_offset = 0;
                for (let i = 0; i < length; i++) {
                    const [value, item_offset] = item_type.read(buffer, offset + array_offset);
                    array_offset += item_offset;
                    result.push(value);
                }
                return [result, array_offset];
            },
            symbol: Symbol(),
        };
        if (!FLArrayCache[item_type.symbol]) FLArrayCache[item_type.symbol] = {};
        FLArrayCache[item_type.symbol][length] = type;
        return type;
    }

    // PArray

    const PArrayCache: Record<symbol, Record<symbol, DataType<any>>> = {};

    export function PArray<T>(
        item_type: DataType<T>,
        len_type: DataType<number | bigint>,
    ): DataType<ArrayLike<T> & Iterable<T>> {
        let cachedType;
        if (PArrayCache[item_type.symbol] && (cachedType = PArrayCache[item_type.symbol][len_type.symbol]))
            return cachedType;

        const type: DataType<ArrayLike<T> & Iterable<T>> = {
            write: function (value: ArrayLike<T> & Iterable<T>): Buffer {
                let result = [len_type.write(value.length)];
                for (let item of value) {
                    result.push(item_type.write(item));
                }
                return Buffer.concat(result);
            },
            read: function (buffer: Buffer, offset: number): [ArrayLike<T> & Iterable<T>, number] {
                const result = [];
                let [length, array_offset] = len_type.read(buffer, offset);
                for (let i = 0; i < length; i++) {
                    const [value, item_offset] = item_type.read(buffer, offset + array_offset);
                    array_offset += item_offset;
                    result.push(value);
                }
                return [result, array_offset];
            },
            symbol: Symbol(),
        };
        if (!PArrayCache[item_type.symbol]) PArrayCache[item_type.symbol] = {};
        PArrayCache[item_type.symbol][len_type.symbol] = type;
        return type;
    }

    // FLString

    const FLStringCache: Record<BufferEncoding, Record<number, DataType<string>>> = {
        ascii: {},
        utf8: {},
        "utf-8": {},
        utf16le: {},
        "utf-16le": {},
        ucs2: {},
        "ucs-2": {},
        base64: {},
        base64url: {},
        latin1: {},
        binary: {},
        hex: {},
    };

    export function FLString(length: number, encoding: BufferEncoding = "utf8"): DataType<string> {
        let cachedType;
        if ((cachedType = FLStringCache[encoding][length])) return cachedType;

        const type: DataType<string> = {
            write: function (value: string): Buffer {
                const strBuffer = Buffer.from(value, encoding);
                if (strBuffer.length != length) throw new FLStringLengthException(length, strBuffer.length);
                const buffer = Buffer.alloc(length);
                buffer.write(value);
                return buffer;
            },
            read: function (buffer: Buffer, offset: number): [string, number] {
                return [buffer.subarray(offset, offset + length).toString(encoding), length];
            },
            symbol: Symbol(),
        };
        FLStringCache[encoding][length] = type;
        return type;
    }

    // PString

    const PStringCache: Record<BufferEncoding, Record<symbol, DataType<string>>> = {
        ascii: {},
        utf8: {},
        "utf-8": {},
        utf16le: {},
        "utf-16le": {},
        ucs2: {},
        "ucs-2": {},
        base64: {},
        base64url: {},
        latin1: {},
        binary: {},
        hex: {},
    };

    export function PString(len_type: DataType<number | bigint>, encoding: BufferEncoding = "utf8") {
        let cachedType;
        if ((cachedType = PStringCache[encoding][len_type.symbol])) return cachedType;

        const type: DataType<string> = {
            write: function (value: string): Buffer {
                const buffer = Buffer.from(value, encoding);
                return Buffer.concat([len_type.write(buffer.length), buffer]);
            },
            read: function (buffer: Buffer, offset: number): [string, number] {
                const [length, len_offset] = len_type.read(buffer, offset);
                return [
                    buffer.subarray(offset + len_offset, offset + len_offset + Number(length)).toString(encoding),
                    len_offset + Number(length),
                ];
            },
            symbol: Symbol(),
        };
        PStringCache[encoding][len_type.symbol] = type;
        return type;
    }
}
