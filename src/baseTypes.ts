import assert from "assert";
import { DataType } from "./dataType";
import { FLStringLengthException } from "./exception/FLStringLengthException";
import { FLArrayLengthException } from "./exception/FLArrayLengthException";
import { VarIntTooLongException } from "./exception/varintTooLongException";
import { UnsignedException } from "./exception/unsignedException";
import { defineType, defineTypeGenerator } from "./defineType";
import { buffer } from "stream/consumers";

export namespace Types {
    // Int8
    export const Int8 = defineType<number>(
        (buffer, offset) => {
            return [buffer.readInt8(offset), 1];
        },
        (value) => {
            assert(Number.isInteger(value), new TypeError("Int8 type requires input of integer"));
            const buffer = Buffer.alloc(1);
            buffer.writeInt8(value);
            return buffer;
        },
    );

    // UInt8

    export const UInt8 = defineType<number>(
        (buffer, offset) => {
            return [buffer.readUInt8(offset), 1];
        },
        (value) => {
            assert(Number.isInteger(value), new TypeError("UInt8 type requires input of integer"));
            const buffer = Buffer.alloc(1);
            buffer.writeUInt8(value);
            return buffer;
        },
    );

    // Int16

    export const Int16 = defineType<number>(
        (buffer, offset) => {
            return [buffer.readInt16BE(offset), 2];
        },
        (value) => {
            assert(Number.isInteger(value), new TypeError("Int16 type requires input of integer"));
            const buffer = Buffer.alloc(2);
            buffer.writeInt16BE(value);
            return buffer;
        },
    );

    export const Int16LE = defineType<number>(
        (buffer, offset) => {
            return [buffer.readInt16LE(offset), 2];
        },
        (value) => {
            assert(Number.isInteger(value), new TypeError("Int16LE type requires input of integer"));
            const buffer = Buffer.alloc(2);
            buffer.writeInt16LE(value);
            return buffer;
        },
    );

    // UInt16

    export const UInt16 = defineType<number>(
        (buffer, offset) => {
            return [buffer.readUInt16BE(offset), 2];
        },
        (value) => {
            assert(Number.isInteger(value), new TypeError("UInt16 type requires input of integer"));
            const buffer = Buffer.alloc(2);
            buffer.writeUInt16BE(value);
            return buffer;
        },
    );

    export const UInt16LE = defineType<number>(
        (buffer, offset) => {
            return [buffer.readUInt16LE(offset), 2];
        },
        (value) => {
            assert(Number.isInteger(value), new TypeError("UInt16LE type requires input of integer"));
            const buffer = Buffer.alloc(2);
            buffer.writeUInt16LE(value);
            return buffer;
        },
    );

    // Int32

    export const Int32 = defineType<number>(
        (buffer, offset) => {
            return [buffer.readInt32BE(offset), 4];
        },
        (value) => {
            assert(Number.isInteger(value), new TypeError("Int32 type requires input of integer"));
            const buffer = Buffer.alloc(4);
            buffer.writeInt32BE(value);
            return buffer;
        },
    );

    export const Int32LE = defineType<number>(
        (buffer, offset) => {
            return [buffer.readInt32LE(offset), 4];
        },
        (value) => {
            assert(Number.isInteger(value), new TypeError("Int32LE type requires input of integer"));
            const buffer = Buffer.alloc(4);
            buffer.writeInt32LE(value);
            return buffer;
        },
    );

    // UInt32

    export const UInt32 = defineType<number>(
        (buffer, offset) => {
            return [buffer.readUInt32BE(offset), 4];
        },
        (value) => {
            assert(Number.isInteger(value), new TypeError("UInt32 type requires input of integer"));
            const buffer = Buffer.alloc(4);
            buffer.writeUInt32BE(value);
            return buffer;
        },
    );

    export const UInt32LE = defineType<number>(
        (buffer, offset) => {
            return [buffer.readUInt32LE(offset), 4];
        },
        (value) => {
            assert(Number.isInteger(value), new TypeError("UInt32LE type requires input of integer"));
            const buffer = Buffer.alloc(4);
            buffer.writeUInt32LE(value);
            return buffer;
        },
    );

    // Int64

    export const Int64 = defineType<bigint>(
        (buffer, offset) => {
            return [buffer.readBigInt64BE(offset), 8];
        },
        // 兼容 PString / PArray 长度部分
        (value: bigint | number) => {
            const buffer = Buffer.alloc(8);
            buffer.writeBigInt64BE(BigInt(value));
            return buffer;
        },
    );

    export const Int64LE = defineType<bigint>(
        (buffer, offset) => {
            return [buffer.readBigInt64LE(offset), 8];
        },
        (value: bigint | number) => {
            const buffer = Buffer.alloc(8);
            buffer.writeBigInt64LE(BigInt(value));
            return buffer;
        },
    );

    // UInt64

    export const UInt64 = defineType<bigint>(
        (buffer, offset) => {
            return [buffer.readBigUInt64BE(offset), 8];
        },
        (value: bigint | number) => {
            const buffer = Buffer.alloc(8);
            buffer.writeBigUInt64BE(BigInt(value));
            return buffer;
        },
    );

    export const UInt64LE = defineType<bigint>(
        (buffer, offset) => {
            return [buffer.readBigUInt64LE(offset), 8];
        },
        (value: bigint | number) => {
            const buffer = Buffer.alloc(8);
            buffer.writeBigUInt64LE(BigInt(value));
            return buffer;
        },
    );

    // Float

    export const Float = defineType<number>(
        (buffer, offset) => {
            return [buffer.readFloatBE(offset), 4];
        },
        (value) => {
            const buffer = Buffer.alloc(4);
            buffer.writeFloatBE(value);
            return buffer;
        },
    );

    export const FloatLE = defineType<number>(
        (buffer, offset) => {
            return [buffer.readFloatLE(offset), 4];
        },
        (value) => {
            const buffer = Buffer.alloc(4);
            buffer.writeFloatLE(value);
            return buffer;
        },
    );

    // Double

    export const Double = defineType<number>(
        (buffer, offset) => {
            return [buffer.readDoubleBE(offset), 8];
        },
        (value) => {
            const buffer = Buffer.alloc(8);
            buffer.writeDoubleBE(value);
            return buffer;
        },
    );

    export const DoubleLE = defineType<number>(
        (buffer, offset) => {
            return [buffer.readDoubleLE(offset), 8];
        },
        (value) => {
            const buffer = Buffer.alloc(8);
            buffer.writeDoubleLE(value);
            return buffer;
        },
    );

    //Array

    type UniversalArray<T> = ArrayLike<T> & Iterable<T>;

    // FLArray

    const FLArrayGenerator = defineTypeGenerator<[DataType<any>, number], UniversalArray<any>>(
        (buffer, offset, item_type, length) => {
            const result: any[] = [];
            let array_offset = 0;
            for (let i = 0; i < length; i++) {
                const [value, item_offset] = item_type.read(buffer, offset + array_offset);
                array_offset += item_offset;
                result.push(value);
            }
            return [result, array_offset];
        },
        (value, item_type, length) => {
            const result = [];
            if (value.length != length) throw new FLArrayLengthException(length, value.length);
            for (let item of value) result.push(item_type.write(item));
            return Buffer.concat(result);
        },
    );

    export function FLArray<T>(...param: [DataType<T>, number]): DataType<UniversalArray<T>> {
        return FLArrayGenerator(...param);
    }

    // PArray

    const PArrayGenerator = defineTypeGenerator<[DataType<any>, DataType<number | bigint>], UniversalArray<any>>(
        (buffer, offset, item_type, len_type) => {
            const result: any[] = [];
            let [length, array_offset] = len_type.read(buffer, offset);
            for (let i = 0; i < length; i++) {
                const [value, item_offset] = item_type.read(buffer, offset + array_offset);
                array_offset += item_offset;
                result.push(value);
            }
            return [result, array_offset];
        },
        (value, item_type, len_type) => {
            let result = [len_type.write(value.length)];
            for (let item of value) {
                result.push(item_type.write(item));
            }
            return Buffer.concat(result);
        },
    );

    export function PArray<T>(...param: [DataType<T>, DataType<number | bigint>]): DataType<UniversalArray<T>> {
        return PArrayGenerator(...param);
    }

    // FLString

    export const FLString = defineTypeGenerator<[number, BufferEncoding?], string>(
        (buffer, offset, length, encoding) => {
            return [buffer.subarray(offset, offset + length).toString(encoding), length];
        },
        (value, length, encoding) => {
            const strBuffer = Buffer.from(value, encoding);
            if (strBuffer.length != length) throw new FLStringLengthException(length, strBuffer.length);
            const buffer = Buffer.alloc(length);
            buffer.write(value);
            return buffer;
        },
    );

    // PString

    export const PString = defineTypeGenerator<[DataType<number | bigint>, BufferEncoding?], string>(
        (buffer, offset, len_type, encoding) => {
            const [length, len_offset] = len_type.read(buffer, offset);
            return [
                buffer.subarray(offset + len_offset, offset + len_offset + Number(length)).toString(encoding),
                len_offset + Number(length),
            ];
        },
        (value, len_type, encoding) => {
            const buffer = Buffer.from(value, encoding);
            return Buffer.concat([len_type.write(buffer.length), buffer]);
        },
    );

    // VarInt

    export const VarInt32 = defineType<number>(
        (buffer, offset) => {
            let value = 0;
            let bytesRead = 0;
            let shift = 0;
            let byte;
            do {
                byte = buffer[offset + bytesRead];
                bytesRead++;
                value |= (byte & 0x7f) << shift;
                shift += 7;
                if (shift >= 32) throw new VarIntTooLongException();
            } while (byte & 0x80);
            return [value, bytesRead];
        },
        (value) => {
            assert(value >= 0, new UnsignedException());
            const buffer = Buffer.alloc(5);
            let n = 0;
            for (; value > 127; n++) {
                buffer[n] = (value & 0x7f) | 0x80;
                value = value >> 7;
            }
            buffer[n] = value & 0xff;
            n++;
            return buffer.subarray(0, n);
        },
    );

    export const VarInt64 = defineType<bigint>(
        (buffer, offset) => {
            let value = 0n;
            let bytesRead = 0;
            let shift = 0;
            let byte;
            do {
                byte = buffer[offset + bytesRead];
                bytesRead++;
                value |= BigInt((byte & 0x7f) << shift);
                shift += 7;
                if (shift >= 64) throw new VarIntTooLongException();
            } while (byte & 0x80);
            return [value, bytesRead];
        },
        (value) => {
            assert(value >= 0, new UnsignedException());
            const buffer = Buffer.alloc(10);
            let n = 0;
            for (; value > 127; n++) {
                buffer[n] = Number((value & 0x7fn) | 0x80n);
                value = value >> 7n;
            }
            buffer[n] = Number(value & 0xffn);
            n++;
            return buffer.subarray(0, n);
        },
    );
}
