import { config } from "process";
import { DataType } from "../dataType";

export type StructConf = Array<{ name: string; type: DataType<any> }>;
export type StructData = { [row_name: string]: any };

export class Struct<T extends StructData> implements DataType<StructData & T> {
    symbol: symbol = Symbol();
    protected config: StructConf;

    constructor(config: StructConf) {
        this.config = config;
    }

    write(value: T): Buffer {
        let result: Buffer[] = [];
        for (let { name, type } of this.config) {
            result.push(type.write(value[name]));
        }
        return Buffer.concat(result);
    }
    read(buffer: Buffer, offset: number): [T, number] {
        let structOffset = offset;
        let result: T = {} as T;
        for (let { name, type } of this.config) {
            let [value, rowOffset] = type.read(buffer, structOffset);
            (result as StructData)[name] = value;
            structOffset += rowOffset;
        }
        return [result, structOffset];
    }

    getConf() {
        return this.config;
    }
}
