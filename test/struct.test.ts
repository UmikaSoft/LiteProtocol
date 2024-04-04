import { Struct } from "../src/struct/struct";
import { StructBuilder } from "../src/struct/structBuilder";
import { randomInt, randomUUID } from "crypto";
import { Types } from "../src/baseTypes";

const config = [
    { name: "row_int8", type: Types.Int8 },
    { name: "row_uint8", type: Types.UInt8 },
    { name: "row_int32", type: Types.Int32 },
    { name: "row_int32le", type: Types.Int32LE },
    { name: "row_uint32", type: Types.UInt32 },
    { name: "row_uint32le", type: Types.UInt32LE },
    { name: "row_int64", type: Types.Int64 },
    { name: "row_int64le", type: Types.Int64LE },
    { name: "row_uint64", type: Types.UInt64 },
    { name: "row_uint64le", type: Types.UInt64LE },
    { name: "row_float", type: Types.Float },
    { name: "row_floatle", type: Types.FloatLE },
    { name: "row_double", type: Types.Double },
    { name: "row_doublele", type: Types.DoubleLE },
    { name: "row_flstring", type: Types.FLString(36) },
    { name: "row_pstring", type: Types.PString(Types.Int32) },
];

type data = {
    row_int8: number;
    row_uint8: number;
    row_int32: number;
    row_int32le: number;
    row_uint32: number;
    row_uint32le: number;
    row_int64: bigint;
    row_int64le: bigint;
    row_uint64: bigint;
    row_uint64le: bigint;
    row_float: number;
    row_floatle: number;
    row_double: number;
    row_doublele: number;
    row_flstring: string;
    row_pstring: string;
};

function getRandomData(): data {
    return {
        row_int8: randomInt(-128, 127),
        row_uint8: randomInt(0, 255),
        row_int32: randomInt(-10000, 10000),
        row_int32le: randomInt(-10000, 10000),
        row_uint32: randomInt(0, 10000),
        row_uint32le: randomInt(0, 10000),
        row_int64: BigInt(randomInt(-10000, 10000)),
        row_int64le: BigInt(randomInt(-10000, 10000)),
        row_uint64: BigInt(randomInt(0, 10000)),
        row_uint64le: BigInt(randomInt(0, 10000)),
        row_float: Math.random(),
        row_floatle: Math.random(),
        row_double: Math.random(),
        row_doublele: Math.random(),
        row_flstring: randomUUID(),
        row_pstring: randomUUID(),
    };
}

test("Test serialization and deserialization of Struct objects with", () => {
    const struct = new Struct<data>(config);

    const data = getRandomData();
    const buffer = struct.write(data);
    const offset = randomInt(0, 100);
    const [newData, length] = struct.read(Buffer.concat([Buffer.alloc(offset), buffer]), offset);

    expect(length).toEqual(buffer.length);

    for (let [key, value] of Object.entries(data)) // 逐一对比以防止序列化bigint报错以及float精准度问题
        if (typeof value === "number") expect(value).toBeCloseTo((newData as any)[key]);
        else expect(value).toEqual((newData as any)[key]);
});

test("Test StrutBuilder class to build struct objects", () => {
    const struct = StructBuilder.new()
        .rowInt8("row_int8")
        .rowUInt8("row_uint8")
        .rowInt32("row_int32")
        .rowInt32LE("row_int32le")
        .rowUInt32("row_uint32")
        .rowUInt32LE("row_uint32le")
        .rowInt64("row_int64")
        .rowInt64LE("row_int64le")
        .rowUInt64("row_uint64")
        .rowUInt64LE("row_uint64le")
        .rowFloat("row_float")
        .rowFloatLE("row_floatle")
        .rowDouble("row_double")
        .rowDoubleLE("row_doublele")
        .rowFLString("row_flstring", 36)
        .rowPString("row_pstring", Types.Int32)
        .build<data>();

    expect(struct.getConf()).toEqual(config);
});
