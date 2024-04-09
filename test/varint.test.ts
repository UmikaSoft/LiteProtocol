import { randomInt } from "crypto";
import { BaseTypes } from "../src/baseTypes";

test("Test serialization and deserialization of String types in BaseTypes", () => {
    let number;
    let buffer;
    let offset;
    let newNumber;
    let length;

    number = randomInt(0, 10000);
    buffer = BaseTypes.VarInt32.write(number);
    offset = randomInt(0, 100);
    [newNumber, length] = BaseTypes.VarInt32.read(Buffer.concat([Buffer.alloc(offset), buffer]), offset);
    expect(length).toEqual(buffer.length);
    expect(newNumber).toEqual(number);
});
