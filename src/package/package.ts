import { DataType } from "../dataType";
import { StructData } from "../struct/struct";

export interface PackageType<T extends StructData> extends DataType<T> {
    new (data: T, buffer: Buffer): BasePackage<T>;
    formData(data?: T): BasePackage<T>;
    fromBuffer(buffer: Buffer, offset: number): BasePackage<T>;
}

export abstract class BasePackage<T extends StructData> {
    readonly data: T;
    readonly buffer: Buffer;

    constructor(data: T, buffer: Buffer) {
        this.data = data;
        this.buffer = buffer;
    }
}
