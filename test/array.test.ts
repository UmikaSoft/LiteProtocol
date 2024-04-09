import { randomInt } from "crypto";
import { BaseTypes } from "../src/baseTypes";
import { randomAsciiStr, randomStr } from "./utils";

function randomArray(length: number, f: () => any) {
    const result: any[] = [];
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
    type = BaseTypes.FLArray(BaseTypes.Int32, length);
    buffer = type.write(numberArray);
    // console.log(buffer);
    [newNumberArray, newLength] = type.read(buffer, 0);
    expect(numberArray).toEqual(newNumberArray);

    // int64Array
    length = randomInt(0, 100);
    let bigintArray: bigint[] = randomArray(length, () => BigInt(randomInt(-10000, 10000)));
    let newBigintArray;
    type = BaseTypes.FLArray(BaseTypes.Int64, length);
    buffer = type.write(bigintArray);
    // console.log(buffer);
    [newBigintArray, newLength] = type.read(buffer, 0);
    expect(bigintArray).toEqual(newBigintArray);

    // TypedInt32Array
    length = randomInt(0, 100);
    let typedInt32Array = new Int32Array(randomArray(length, () => randomInt(-10000, 10000)));
    let newTypedInt32Array;
    type = BaseTypes.FLArray(BaseTypes.Int32, length);
    buffer = type.write(typedInt32Array);
    [newTypedInt32Array, newLength] = type.read(buffer, 0);
    newTypedInt32Array = new Int32Array(newTypedInt32Array);
    expect(typedInt32Array).toEqual(newTypedInt32Array);

    // TypedInt64Array
    length = randomInt(0, 100);
    let typedInt64Array = new BigInt64Array(randomArray(length, () => BigInt(randomInt(-10000, 10000))));
    let newTypedInt64Array;
    type = BaseTypes.FLArray(BaseTypes.Int64, length);
    buffer = type.write(typedInt64Array);
    [newTypedInt64Array, newLength] = type.read(buffer, 0);
    newTypedInt64Array = new BigInt64Array(newTypedInt64Array);
    expect(typedInt64Array).toEqual(newTypedInt64Array);

    // FLStringArray
    length = randomInt(0, 100);
    let stringLength = randomInt(0, 1000);
    let flstringArray: string[] = randomArray(length, () => randomAsciiStr(stringLength));
    let newFlstringArray;
    type = BaseTypes.FLArray(BaseTypes.FLString(stringLength), length);
    buffer = type.write(flstringArray);
    // console.log(buffer);
    [newFlstringArray, newLength] = type.read(buffer, 0);
    expect(flstringArray).toEqual(newFlstringArray);

    // PStringArray
    length = randomInt(0, 100);
    let pstringArray: string[] = randomArray(length, () => randomStr(randomInt(0, 1000)));
    let newPstringArray;
    type = BaseTypes.FLArray(BaseTypes.PString(BaseTypes.Int32), length);
    buffer = type.write(pstringArray);
    // console.log(buffer);
    [newPstringArray, newLength] = type.read(buffer, 0);
    expect(pstringArray).toEqual(newPstringArray);
});
