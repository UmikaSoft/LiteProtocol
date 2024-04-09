import { BaseTypes } from "../baseTypes";
import { DataType } from "../dataType";
import { Struct, StructConf, StructData } from "./struct";

export class StructBuilder {
    static new() {
        return new this();
    }

    protected structConf: StructConf = [];

    build<T extends StructData>(): Struct<T> {
        return new Struct(this.structConf);
    }

    row<T>(name: string, type: DataType<T>, default_value?: T) {
        this.structConf.push({ name, type, ...(default_value === undefined ? null : { default: default_value }) });
        return this;
    }

    // Int8

    rowInt8(name: string, default_value?: number) {
        this.row(name, BaseTypes.Int8, default_value);
        return this;
    }

    // UInt8

    rowUInt8(name: string, default_value?: number) {
        this.row(name, BaseTypes.UInt8, default_value);
        return this;
    }

    // Int16

    rowInt16(name: string, default_value?: number) {
        this.row(name, BaseTypes.Int16, default_value);
        return this;
    }

    rowInt16LE(name: string, default_value?: number) {
        this.row(name, BaseTypes.Int16LE, default_value);
        return this;
    }

    // UInt16

    rowUInt16(name: string, default_value?: number) {
        this.row(name, BaseTypes.UInt16, default_value);
        return this;
    }

    rowUInt16LE(name: string, default_value?: number) {
        this.row(name, BaseTypes.UInt16LE, default_value);
        return this;
    }

    // Int32

    rowInt32(name: string, default_value?: number) {
        this.row(name, BaseTypes.Int32, default_value);
        return this;
    }

    rowInt32LE(name: string, default_value?: number) {
        this.row(name, BaseTypes.Int32LE, default_value);
        return this;
    }

    // UInt32

    rowUInt32(name: string, default_value?: number) {
        this.row(name, BaseTypes.UInt32, default_value);
        return this;
    }

    rowUInt32LE(name: string, default_value?: number) {
        this.row(name, BaseTypes.UInt32LE, default_value);
        return this;
    }

    // Int64

    rowInt64(name: string, default_value?: bigint) {
        this.row(name, BaseTypes.Int64, default_value);
        return this;
    }

    rowInt64LE(name: string, default_value?: bigint) {
        this.row(name, BaseTypes.Int64LE, default_value);
        return this;
    }

    // UInt64

    rowUInt64(name: string, default_value?: bigint) {
        this.row(name, BaseTypes.UInt64, default_value);
        return this;
    }

    rowUInt64LE(name: string, default_value?: bigint) {
        this.row(name, BaseTypes.UInt64LE, default_value);
        return this;
    }

    //Float

    rowFloat(name: string, default_value?: number) {
        this.row(name, BaseTypes.Float, default_value);
        return this;
    }

    rowFloatLE(name: string, default_value?: number) {
        this.row(name, BaseTypes.FloatLE, default_value);
        return this;
    }

    // Double

    rowDouble(name: string, default_value?: number) {
        this.row(name, BaseTypes.Double, default_value);
        return this;
    }

    rowDoubleLE(name: string, default_value?: number) {
        this.row(name, BaseTypes.DoubleLE, default_value);
        return this;
    }

    //FLArray

    rowFLArray<T>(name: string, item_type: DataType<T>, length: number, default_value?: ArrayLike<T> & Iterable<T>) {
        this.row(name, BaseTypes.FLArray(item_type, length), default_value);
    }

    //PArray

    rowPArray<T>(
        name: string,
        item_type: DataType<T>,
        len_type: DataType<number | bigint>,
        default_value?: ArrayLike<T> & Iterable<T>,
    ) {
        this.row(name, BaseTypes.PArray(item_type, len_type), default_value);
    }

    //FLString

    rowFLString(name: string, length: number, encoding?: BufferEncoding, default_value?: string) {
        this.row(name, BaseTypes.FLString(length, encoding), default_value);
        return this;
    }

    // PString

    rowPString(name: string, len_type: DataType<number | bigint>, encoding?: BufferEncoding, default_value?: string) {
        this.row(name, BaseTypes.PString(len_type, encoding), default_value);
        return this;
    }

    //VarInt

    rowVarInt32(name: string, default_value?: number) {
        this.row(name, BaseTypes.VarInt32, default_value);
        return this;
    }

    rowVarInt64(name: string, default_value?: bigint) {
        this.row(name, BaseTypes.VarInt64, default_value);
        return this;
    }
}
