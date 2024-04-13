import { Struct, StructData } from "../struct/struct";
import { Package, PackageType } from "./package";

export function definePackage<T extends StructData>(struct: Struct<T>): PackageType<T> {
    return class NewPackage extends Package<T> {
        static formData(data: T): NewPackage {
            return new this(data, struct.write(data));
        }
        static fromBuffer(buffer: Buffer, offset: number): NewPackage {
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
