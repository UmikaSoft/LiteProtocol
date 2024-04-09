export class VarIntTooLongException extends Error {
    constructor() {
        super("VarInt too long");
    }
}
