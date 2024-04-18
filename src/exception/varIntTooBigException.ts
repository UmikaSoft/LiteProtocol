import { LiteProtocolError } from "./liteProtocolError";

export class VarIntTooBigException extends LiteProtocolError {
    constructor() {
        super("VarInt too big");
    }
}
