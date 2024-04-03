import { randomInt } from "crypto";
import { Types } from "../src/baseTypes";
import { randomAsciiStr, randomStr } from "./utils";

function randomArray(length: number, f: () => any) {
    const result = [];
    for (let i = 0; i < length; i++) {
        result.push(f());
    }
    return result;
}

test("Test serialization and deserialization of Array types in BaseTypes", () => {
    let buffer;
    let type;
    let length;
    let newLength;

    // int32Array
    length = randomInt(0, 100);
    let numberArray: number[] = randomArray(length, () => randomInt(-10000, 10000));
    let newNumberArray;
    type = Types.FLArray(Types.Int32, length);
    buffer = type.write(numberArray);
    // console.log(buffer);
    [newNumberArray, newLength] = type.read(buffer, 0);
    expect(numberArray).toEqual(newNumberArray);

    // int64Array
    length = randomInt(0, 100);
    let bigintArray: bigint[] = randomArray(length, () => BigInt(randomInt(-10000, 10000)));
    let newBigintArray;
    type = Types.FLArray(Types.Int64, length);
    buffer = type.write(bigintArray);
    // console.log(buffer);
    [newBigintArray, newLength] = type.read(buffer, 0);
    expect(bigintArray).toEqual(newBigintArray);

    // FLStringArray
    length = randomInt(0, 100);
    let stringLength = randomInt(0, 1000);
    let flstringArray: string[] = randomArray(length, () => randomAsciiStr(stringLength));
    let newFlstringArray;
    type = Types.FLArray(Types.FLString(stringLength), length);
    buffer = type.write(flstringArray);
    // console.log(buffer);
    [newFlstringArray, newLength] = type.read(buffer, 0);
    expect(flstringArray).toEqual(newFlstringArray);

    // PStringArray
    length = randomInt(0, 100);
    let pstringArray: string[] = randomArray(length, () => randomStr(randomInt(0, 1000)));
    let newPstringArray;
    type = Types.FLArray(Types.PString(Types.Int32), length);
    buffer = type.write(pstringArray);
    // console.log(buffer);
    [newPstringArray, newLength] = type.read(buffer, 0);
    expect(pstringArray).toEqual(newPstringArray);
});
