import { BaseTypes } from "../baseTypes";
import { DataType } from "../dataType";
import { definePackage } from "../package/definePackages";
import { PackageType } from "../package/package";

export type StructConfItem<T extends string, U> = { name: T; type: DataType<U>; default?: U };
export type StructConf<T extends string, U> = Array<StructConfItem<T, U>>;
// export type StructData = { [row_name: string]: any };

export class Struct<
    CONF extends StructConf<keyof T & string, T[keyof T & string]>,
    T extends {
        [key in keyof CONF extends number
            ? keyof CONF
            : never as CONF[key]["name"]]: CONF[key]["type"] extends DataType<infer U> ? U : never;
    }, // FIXME
> implements DataType<T>
{
    readonly config: CONF;

    constructor(config: CONF) {
        this.config = config;
    }

    write(value: T): Buffer {
        const result: Buffer[] = [];
        for (let { name, type, default: defaultValue } of this.config) {
            const fixedValue = value[name];
            result.push(type.write(fixedValue !== undefined ? fixedValue : (defaultValue as T[keyof T & string])));
        }
        return Buffer.concat(result);
    }
    read(buffer: Buffer, offset: number): [T, number] {
        let structOffset = 0;
        let result: T = {} as T;
        for (let { name, type } of this.config) {
            let [value, rowOffset] = type.read(buffer, offset + structOffset);
            result[name] = value;
            structOffset += rowOffset;
        }
        return [result, structOffset];
    }

    toPackage(): PackageType<T> {
        return definePackage(this);
    }
}

const a = new Struct([
    {
        name: "awa",
        type: BaseTypes.Int64,
    },
    {
        name: "qwq",
        type: BaseTypes.Double,
    },
    {
        name: "s",
        type: BaseTypes.PString(BaseTypes.Int32),
    },
]);

a.write({
    awa: 100,
    qwq: "",
    s: "",
});
