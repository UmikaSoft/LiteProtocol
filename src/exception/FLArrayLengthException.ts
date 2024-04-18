import { LiteProtocolError } from "./liteProtocolError";

export class FLArrayLengthException extends LiteProtocolError {
    constructor(request_length: number, provided_length: number) {
        super(
            `Request an array with a length of ${request_length}, but provide an array with a length of ${provided_length}`,
        );
    }
}
