import { Types } from "../baseTypes";
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

    var(name: string, type: DataType<any>) {
        this.structConf.push({ name, type });
        return this;
    }

    // Int8

    varInt8(name: string) {
        this.var(name, Types.Int8);
        return this;
    }

    // UInt8

    varUInt8(name: string) {
        this.var(name, Types.UInt8);
        return this;
    }

    // Int32

    varInt32(name: string) {
        this.var(name, Types.Int32);
        return this;
    }

    varInt32LE(name: string) {
        this.var(name, Types.Int32LE);
        return this;
    }

    // UInt32

    varUInt32(name: string) {
        this.var(name, Types.UInt32);
        return this;
    }

    varUInt32LE(name: string) {
        this.var(name, Types.UInt32LE);
        return this;
    }

    // Int64

    varInt64(name: string) {
        this.var(name, Types.Int64);
        return this;
    }

    varInt64LE(name: string) {
        this.var(name, Types.Int64LE);
        return this;
    }

    // UInt64

    varUInt64(name: string) {
        this.var(name, Types.UInt64);
        return this;
    }

    varUInt64LE(name: string) {
        this.var(name, Types.UInt64LE);
        return this;
    }

    //Float

    varFloat(name: string) {
        this.var(name, Types.Float);
        return this;
    }

    varFloatLE(name: string) {
        this.var(name, Types.FloatLE);
        return this;
    }

    // Double

    varDouble(name: string) {
        this.var(name, Types.Double);
        return this;
    }

    varDoubleLE(name: string) {
        this.var(name, Types.DoubleLE);
        return this;
    }

    //FLArray

    varFLArray(name: string, item_type: DataType<any>, length: number) {
        this.var(name, Types.FLArray(item_type, length));
    }

    //PArray

    varPArray(name: string, item_type: DataType<any>, len_type: DataType<number | bigint>) {
        this.var(name, Types.PArray(item_type, len_type));
    }

    //FLString

    varFLString(name: string, length: number, encoding?: BufferEncoding) {
        this.var(name, Types.FLString(length, encoding));
        return this;
    }

    // PString

    varPString(name: string, len_type: DataType<number | bigint>, encoding?: BufferEncoding) {
        this.var(name, Types.PString(len_type, encoding));
        return this;
    }
}
