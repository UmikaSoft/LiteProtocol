import { DataType } from "../dataType";
import { definePackage } from "../package/definePackages";
import { PackageType } from "../package/package";

export type StructConf = Array<{ name: string; type: DataType<any>; default?: any }>;
export type StructData = { [row_name: string]: any };

export class Struct<T extends StructData> implements DataType<StructData & T> {
    readonly config: StructConf;

    constructor(config: StructConf) {
        this.config = config;
    }

    write(value: T): Buffer {
        const result: Buffer[] = [];
        for (let { name, type, default: defaultValue } of this.config) {
            const fixedValue = value[name];
            result.push(type.write(fixedValue !== undefined ? fixedValue : defaultValue));
        }
        return Buffer.concat(result);
    }
    read(buffer: Buffer, offset: number): [T, number] {
        let structOffset = 0;
        let result: T = {} as T;
        for (let { name, type } of this.config) {
            let [value, rowOffset] = type.read(buffer, offset + structOffset);
            (result as StructData)[name] = value;
            structOffset += rowOffset;
        }
        return [result, structOffset];
    }

    toPackage(): PackageType<T> {
        return definePackage(this);
    }
}
