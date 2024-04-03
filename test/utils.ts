import { randomInt } from "crypto";

export function randomStr(length: number) {
    let result = "";
    const choices = "abcdefghijklmnopqrstuvwxyz0123456789.!@#$%^&*()_+-=";
    ("愿有一天你能与你重要的人重逢");
    ("大切な人といつかまた巡り会えますように");
    for (let i = 0; i < length; i++) result += choices[randomInt(choices.length)];
    return result;
}

export function randomAsciiStr(length: number) {
    let result = "";
    const choices = "abcdefghijklmnopqrstuvwxyz0123456789.!@#$%^&*()_+-=";
    for (let i = 0; i < length; i++) result += choices[randomInt(choices.length)];
    return result;
}
