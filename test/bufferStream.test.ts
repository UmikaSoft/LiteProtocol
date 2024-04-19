import { randomInt } from "crypto";
import { BaseTypes } from "../src/baseTypes";
import { BufferStream } from "../src/bufferStream";
import { randomArray } from "./utils";

test("Test the read and write of bufferStream", () => {
    const bs = new BufferStream();
    const length = 10000;
    const array = randomArray(length, () => randomInt(0, 10000));

    console.time(`BufferStream reads and writes ${length} times`);

    for (let i of array) {
        bs.put(BaseTypes.VarInt32, i);
    }

    const newArray: number[] = [];
    for (let i = 0; i < length; i++) {
        newArray.push(bs.get(BaseTypes.VarInt32));
    }

    console.timeEnd(`BufferStream reads and writes ${length} times`);

    for (let [index, item] of array.entries()) {
        expect(newArray[index]).toEqual(item);
    }
});
