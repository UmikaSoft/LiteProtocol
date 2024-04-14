import { DataType } from "../dataType";
import { StructData } from "../struct/struct";

export interface PackageType<T extends StructData> extends DataType<T> {
    new (data: T, buffer: Buffer): Package<T>;
    formData(data: T): Package<T>;
    fromBuffer(buffer: Buffer, offset: number): Package<T>;
}

export abstract class Package<T extends StructData> {
    readonly data: T;
    readonly buffer: Buffer;

    constructor(data: T, buffer: Buffer) {
        this.data = data;
        this.buffer = buffer;
    }
}
