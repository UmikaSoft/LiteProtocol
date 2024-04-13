import { Struct } from "../src/struct/struct";
import { StructBuilder } from "../src/struct/structBuilder";
import { randomInt, randomUUID } from "crypto";
import { BaseTypes } from "../src/baseTypes";

const config = [
    { name: "row_int8", type: BaseTypes.Int8 },
    { name: "row_uint8", type: BaseTypes.UInt8 },

    { name: "row_int16", type: BaseTypes.Int16 },
    { name: "row_int16le", type: BaseTypes.Int16LE },
    { name: "row_uint16", type: BaseTypes.UInt16 },
    { name: "row_uint16le", type: BaseTypes.UInt16LE },

    { name: "row_int32", type: BaseTypes.Int32 },
    { name: "row_int32le", type: BaseTypes.Int32LE },
    { name: "row_uint32", type: BaseTypes.UInt32 },
    { name: "row_uint32le", type: BaseTypes.UInt32LE },

    { name: "row_int64", type: BaseTypes.Int64 },
    { name: "row_int64le", type: BaseTypes.Int64LE },
    { name: "row_uint64", type: BaseTypes.UInt64 },
    { name: "row_uint64le", type: BaseTypes.UInt64LE },

    { name: "row_float", type: BaseTypes.Float },
    { name: "row_floatle", type: BaseTypes.FloatLE },

    { name: "row_double", type: BaseTypes.Double },
    { name: "row_doublele", type: BaseTypes.DoubleLE },

    { name: "row_flstring", type: BaseTypes.FLString(36) },
    { name: "row_pstring", type: BaseTypes.PString(BaseTypes.Int32) },

    { name: "row_default_int8", type: BaseTypes.Int8, default: 114 },
    { name: "row_default_uint8", type: BaseTypes.UInt8, default: 114 },
];

type data = {
    row_int8: number;
    row_uint8: number;

    row_int16: number;
    row_int16le: number;
    row_uint16: number;
    row_uint16le: number;

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

    row_default_int8?: number;
    row_default_uint8?: number;
};

function getRandomData(): data {
    return {
        row_int8: randomInt(-128, 128),
        row_uint8: randomInt(0, 255),

        row_int16: randomInt(-1000, 1000),
        row_int16le: randomInt(-1000, 1000),
        row_uint16: randomInt(0, 1000),
        row_uint16le: randomInt(0, 1000),

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

test("Test serialization and deserialization of Struct objects", () => {
    const struct = new Struct<data>(config);

    const data = getRandomData();
    const buffer = struct.write(data);
    const offset = randomInt(0, 100);
    const [newData, length] = struct.read(Buffer.concat([Buffer.alloc(offset), buffer]), offset);

    expect(length).toEqual(buffer.length);

    for (let [key, value] of Object.entries(newData)) {
        // 逐一对比以防止序列化bigint报错以及float精准度问题
        const fixedValue = (data as any)[key];
        if (typeof value === "number") expect(value).toBeCloseTo(fixedValue !== undefined ? fixedValue : 114);
        else expect(value).toEqual(fixedValue !== undefined ? fixedValue : 114);
    }
});

test("Test StrutBuilder class to build struct objects", () => {
    const struct = StructBuilder.new()
        .rowInt8("row_int8")
        .rowUInt8("row_uint8")

        .rowInt16("row_int16")
        .rowInt16LE("row_int16le")
        .rowUInt16("row_uint16")
        .rowUInt16LE("row_uint16le")

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

        .rowFLString("row_flstring")(36)
        .rowPString("row_pstring")(BaseTypes.Int32)

        .rowInt8("row_default_int8", 114)
        .rowUInt8("row_default_uint8", 114)

        .build<data>();

    expect(struct.getConf()).toEqual(config);
});
