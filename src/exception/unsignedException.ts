export class UnsignedException extends Error {
    constructor() {
        super("The provided number must be greater than or equal to 0");
    }
}
