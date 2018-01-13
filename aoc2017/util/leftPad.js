module.exports = function leftPad(_input, length, padChar = ' ') {
    const input = String(_input);
    if (input.length < length) {
        return padChar.repeat(length - input.length) + input;
    }
    return input;
}
