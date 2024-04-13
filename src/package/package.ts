import { DataType } from "../dataType";
import { StructData } from "../struct/struct";

export interface PackageType<T extends StructData> extends DataType<T> {
    formData(data: T): Package<T>;
    fromBuffer(buffer: Buffer, offset: number): Package<T>;
}

export class Package<T extends StructData> {
    data: T;
    buffer: Buffer;

    constructor(data: T, buffer: Buffer) {
        this.data = data;
        this.buffer = buffer;
    }
}
