import { LiteProtocolError } from "./liteProtocolError";

export class UnsignedException extends LiteProtocolError {
    constructor() {
        super("The provided number must be greater than or equal to 0");
    }
}
