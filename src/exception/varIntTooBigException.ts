export class VarIntTooBigException extends Error {
    constructor() {
        super("VarInt too big");
    }
}
