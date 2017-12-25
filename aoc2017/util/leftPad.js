module.exports = function leftPad(input, length, padChar) {
    if (input.length < length) {
        return padChar.repeat(length - input.length) + input;
    }
    return input;
}
