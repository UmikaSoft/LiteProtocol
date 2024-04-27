import { DataType } from "../dataType";
import { definePackage } from "../package/definePackages";
import { PackageType } from "../package/package";

export type StructConf = Array<{ name: string; type: DataType<any>; default?: any; condition?: ItemCondition }>;
export type StructData = { [row_name: string]: any };

export type ItemCondition = (data: StructData) => boolean;

export class Struct<T extends StructData> implements DataType<StructData & T> {
    readonly config: StructConf;

    constructor(config: StructConf) {
        this.config = config;
    }

    write(value: T): Buffer {
        const result: Buffer[] = [];
        for (let { name, type, default: defaultValue, condition } of this.config) {
            if (condition && !condition(value)) continue;
            const itemValue = value[name] ?? defaultValue;
            result.push(type.write(itemValue));
        }
        return Buffer.concat(result);
    }
    read(buffer: Buffer, offset: number): [T, number] {
        let structOffset = 0;
        let result: T = {} as T;
        for (let { name, type, condition } of this.config) {
            if (condition && !condition(result)) continue;
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
