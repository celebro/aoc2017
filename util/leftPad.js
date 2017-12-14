module.exports = function leftPad(input, length, padChar) {
    return padChar.repeat(length - input.length) + input;
}
