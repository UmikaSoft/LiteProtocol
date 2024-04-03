import { randomInt } from "crypto";
import { Types } from "../src/baseTypes";
import { StructBuilder } from "../src/struct/structBuilder";
import { randomAsciiStr, randomStr } from "./utils";

test("Test serialization and deserialization of String types in BaseTypes", () => {
    let param_buffer;
    let str_buffer;
    let str;

    str = randomStr(randomInt(0, 10000));
    str_buffer = Buffer.from(str);
    param_buffer = Types.Int32.write(str_buffer.length);
    expect(Types.PString(Types.Int32).write(str)).toEqual(Buffer.concat([param_buffer, str_buffer]));

    str = randomStr(randomInt(0, 10000));
    str_buffer = Buffer.from(str);
    param_buffer = Types.Int64.write(BigInt(str_buffer.length));
    expect(Types.PString(Types.Int64).write(str)).toEqual(Buffer.concat([param_buffer, str_buffer]));
});

test("Test the serialization and deserialization of String types in BaseTypes in Struct objects", () => {
    let struct;
    let buffer;
    let data;
    let newData;
    let length;

    // FLString

    struct = StructBuilder.new().varInt8("row_int8").varFLString("row_string", 10).varInt32("row_int32").build<{
        row_int8: number;
        row_string: string;
        row_int32: number;
    }>();
    data = {
        row_int8: randomInt(-128, 127),
        row_string: randomAsciiStr(10),
        row_int32: randomInt(-10000, 10000),
    };
    buffer = struct.write(data);
    [newData, length] = struct.read(buffer, 0);

    expect(length).toEqual(buffer.length);
    expect(newData).toEqual(data);

    // PString

    struct = StructBuilder.new().varInt8("row_int8").varPString("row_string", Types.Int32).varInt32("row_int32").build<{
        row_int8: number;
        row_string: string;
        row_int32: number;
    }>();
    data = {
        row_int8: randomInt(-128, 127),
        row_string: randomStr(randomInt(0, 10000)),
        row_int32: randomInt(-10000, 10000),
    };
    buffer = struct.write(data);
    [newData, length] = struct.read(buffer, 0);

    expect(length).toEqual(buffer.length);
    expect(newData).toEqual(data);
});
