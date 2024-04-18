import { LiteProtocolError } from "./liteProtocolError";

export class VarIntTooLongException extends LiteProtocolError {
    constructor() {
        super("VarInt too long");
    }
}
