import { LiteProtocolError } from "./liteProtocolError";

export class BufferOutOfBoundsException extends LiteProtocolError implements RangeError {
    constructor() {
        super(`Buffer out of bounds`);
    }
}
