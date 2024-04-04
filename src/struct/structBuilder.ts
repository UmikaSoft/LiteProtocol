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

    row(name: string, type: DataType<any>) {
        this.structConf.push({ name, type });
        return this;
    }

    // Int8

    rowInt8(name: string) {
        this.row(name, Types.Int8);
        return this;
    }

    // UInt8

    rowUInt8(name: string) {
        this.row(name, Types.UInt8);
        return this;
    }

    // Int32

    rowInt32(name: string) {
        this.row(name, Types.Int32);
        return this;
    }

    rowInt32LE(name: string) {
        this.row(name, Types.Int32LE);
        return this;
    }

    // UInt32

    rowUInt32(name: string) {
        this.row(name, Types.UInt32);
        return this;
    }

    rowUInt32LE(name: string) {
        this.row(name, Types.UInt32LE);
        return this;
    }

    // Int64

    rowInt64(name: string) {
        this.row(name, Types.Int64);
        return this;
    }

    rowInt64LE(name: string) {
        this.row(name, Types.Int64LE);
        return this;
    }

    // UInt64

    rowUInt64(name: string) {
        this.row(name, Types.UInt64);
        return this;
    }

    rowUInt64LE(name: string) {
        this.row(name, Types.UInt64LE);
        return this;
    }

    //Float

    rowFloat(name: string) {
        this.row(name, Types.Float);
        return this;
    }

    rowFloatLE(name: string) {
        this.row(name, Types.FloatLE);
        return this;
    }

    // Double

    rowDouble(name: string) {
        this.row(name, Types.Double);
        return this;
    }

    rowDoubleLE(name: string) {
        this.row(name, Types.DoubleLE);
        return this;
    }

    //FLArray

    rowFLArray(name: string, item_type: DataType<any>, length: number) {
        this.row(name, Types.FLArray(item_type, length));
    }

    //PArray

    rowPArray(name: string, item_type: DataType<any>, len_type: DataType<number | bigint>) {
        this.row(name, Types.PArray(item_type, len_type));
    }

    //FLString

    rowFLString(name: string, length: number, encoding?: BufferEncoding) {
        this.row(name, Types.FLString(length, encoding));
        return this;
    }

    // PString

    rowPString(name: string, len_type: DataType<number | bigint>, encoding?: BufferEncoding) {
        this.row(name, Types.PString(len_type, encoding));
        return this;
    }
}
