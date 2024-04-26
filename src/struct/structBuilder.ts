import { BaseTypes } from "../baseTypes";
import { DataType } from "../dataType";
import { TypeGenerator } from "../defineType";
import { Struct, StructConf, StructData } from "./struct";

export class StructBuilder {
    static new() {
        return new this();
    }

    readonly structConf: StructConf = [];

    build<T extends StructData>(): Struct<T> {
        return new Struct(this.structConf);
    }

    row<T>(name: string, type: DataType<T>, default_value?: T) {
        this.structConf.push({ name, type, ...(default_value === undefined ? null : { default: default_value }) });
        return this;
    }
    generatorRow<C extends any[], T>(name: string, generator: TypeGenerator<C, T>, default_value?: T) {
        return (...param: C) => {
            this.row(name, generator(...param), default_value);
            return this;
        };
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

    rowFLArray<T>(
        name: string,
        default_value?: ArrayLike<T> & Iterable<T>,
    ): (item_type: DataType<T>, length: number) => this {
        return this.generatorRow(name, BaseTypes.FLArray, default_value);
    }

    //PArray

    rowPArray<T>(
        name: string,
        default_value?: ArrayLike<T> & Iterable<T>,
    ): (item_type: DataType<T>, len_type: DataType<number | bigint>) => this {
        return this.generatorRow(name, BaseTypes.PArray, default_value);
    }

    //FLString

    rowFLString(name: string, default_value?: string): (length: number, encoding?: BufferEncoding) => this {
        return this.generatorRow(name, BaseTypes.FLString, default_value);
    }

    // PString

    rowPString(
        name: string,
        default_value?: string,
    ): (len_type: DataType<number | bigint>, encoding?: BufferEncoding) => this {
        return this.generatorRow(name, BaseTypes.PString, default_value);
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

    // ZigZag

    rowZigZag32(name: string, default_value?: number) {
        this.row(name, BaseTypes.ZigZag32, default_value);
        return this;
    }

    rowZigZag64(name: string, default_value?: bigint) {
        this.row(name, BaseTypes.ZigZag64, default_value);
        return this;
    }
}
