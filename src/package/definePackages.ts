import { Struct, StructData } from "../struct/struct";
import { BasePackage, PackageType } from "./package";

export function definePackage<T extends StructData>(struct: Struct<T>): PackageType<T> {
    return class Package extends BasePackage<T> {
        static formData(data: T = {} as T): Package {
            return new this(data, struct.write(data));
        }
        static fromBuffer(buffer: Buffer, offset: number): Package {
            const [data, length] = struct.read(buffer, offset);
            return new this(data, buffer.subarray(offset, offset + length));
        }
        static read(buffer: Buffer, offset: number): [T, number] {
            return struct.read(buffer, offset);
        }
        static write(data: T): Buffer {
            return struct.write(data);
        }
    };
}
