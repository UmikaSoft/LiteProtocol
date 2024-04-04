import { randomInt } from "crypto";
import { Types } from "../src/baseTypes";

test("Test serialization and deserialization of String types in BaseTypes", () => {
    let number;
    let buffer;
    let offset;
    let newNumber;
    let length;

    number = randomInt(0,10000);
    buffer = Types.VarInt32.write(number);
    offset = randomInt(0, 100);
    console.log(buffer);
    [newNumber, length] = Types.VarInt32.read(Buffer.concat([Buffer.alloc(offset), buffer]), offset);
    expect(newNumber).toEqual(number);
});
