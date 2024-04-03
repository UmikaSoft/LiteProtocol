export class FLStringLengthException extends Error {
    constructor(request_length: number, provided_length: number) {
        super(
            `Request an string with a length of ${request_length}, but provide an string with a length of ${provided_length}`,
        );
    }
}
