import { randomInt } from "crypto";
import { BaseTypes } from "../src/baseTypes";
import { StructBuilder } from "../src/struct/structBuilder";
import { randomAsciiStr, randomStr } from "./utils";
import { BufferOutOfBoundsException } from "../src/exception/bufferOutOfBoundsException";

test("Test serialization and deserialization of String types in BaseTypes", () => {
    let type;
    let lenBuffer;
    let strBuffer;
    let buffer;
    let str;
    let offset;
    let newStr;
    let length;

    // PString-Int32

    str = randomStr(randomInt(0, 100));
    strBuffer = Buffer.from(str);
    lenBuffer = BaseTypes.Int32.write(strBuffer.length);
    buffer = Buffer.concat([lenBuffer, strBuffer]);

    type = BaseTypes.PString(BaseTypes.Int32);
    expect(type.write(str)).toEqual(buffer);
    offset = randomInt(0, 100);
    [newStr, length] = type.read(Buffer.concat([Buffer.alloc(offset), buffer]), offset);
    expect(newStr).toEqual(str);
    expect(length).toEqual(buffer.length);

    //PString-Int64

    str = randomStr(randomInt(0, 10000));
    strBuffer = Buffer.from(str);
    lenBuffer = BaseTypes.Int64.write(BigInt(strBuffer.length));
    buffer = Buffer.concat([lenBuffer, strBuffer]);

    type = BaseTypes.PString(BaseTypes.Int64);
    expect(type.write(str)).toEqual(buffer);
    offset = randomInt(0, 100);
    [newStr, length] = type.read(Buffer.concat([Buffer.alloc(offset), buffer]), offset);
    expect(newStr).toEqual(str);
    expect(length).toEqual(buffer.length);
});

test("Test the serialization and deserialization of String types in BaseTypes in Struct objects", () => {
    let struct;
    let offset;
    let buffer;
    let data;
    let newData;
    let length;

    // FLString

    struct = StructBuilder.new().rowInt8("row_int8").rowFLString("row_string")(10).rowInt32("row_int32").build<{
        row_int8: number;
        row_string: string;
        row_int32: number;
    }>();
    data = {
        row_int8: randomInt(-128, 128),
        row_string: randomAsciiStr(10),
        row_int32: randomInt(-10000, 10000),
    };
    buffer = struct.write(data);
    offset = randomInt(0, 100);
    [newData, length] = struct.read(Buffer.concat([Buffer.alloc(offset), buffer]), offset);

    expect(length).toEqual(buffer.length);
    expect(newData).toEqual(data);

    // PString

    struct = StructBuilder.new()
        .rowInt8("row_int8")
        .rowPString("row_string")(BaseTypes.Int32)
        .rowInt32("row_int32")
        .build<{
            row_int8: number;
            row_string: string;
            row_int32: number;
        }>();
    data = {
        row_int8: randomInt(-128, 128),
        row_string: randomStr(randomInt(0, 10000)),
        row_int32: randomInt(-10000, 10000),
    };
    buffer = struct.write(data);
    offset = randomInt(0, 100);
    [newData, length] = struct.read(Buffer.concat([Buffer.alloc(offset), buffer]), offset);

    expect(length).toEqual(buffer.length);
    expect(newData).toEqual(data);
});

test("Test buffer out of bounds", () => {
    const buffer = Buffer.alloc(10);
    try {
        BaseTypes.FLString(buffer.length + 1).read(buffer, 0);
        throw Error();
    } catch (e) {
        if (!(e instanceof BufferOutOfBoundsException)) throw e;
    }
});
