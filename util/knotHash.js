const leftPad = require('./leftPad');
const mod = require('./mod')

module.exports = function knotHash(input, MAX = 256) {
    let data = new Array(MAX);
    for (let i = 0; i < MAX; i++) {
        data[i] = i;
    }

    const lengths = input
        .split('')
        .map(ch => ch.charCodeAt(0))
        .map(Number)
        .concat([17, 31, 73, 47, 23]);

    let current = 0;
    let skip = 0;

    for (let i = 0; i < 64; i++) {
        for (let j = 0; j < lengths.length; j++) {
            const len = lengths[j];
            const end = current + len - 1;

            for (let d = 0; d <= (end - current) / 2; d++) {
                const ixa = mod(current + d, MAX);
                const ixb = mod(end - d, MAX);

                const tmp = data[ixa];
                data[ixa] = data[ixb];
                data[ixb] = tmp;
            }

            current = mod(current + len + skip, MAX);
            skip += 1;
        }
    }

    const packed = [];
    for (let i = 0; i < MAX; i += 16) {
        const slice = data.slice(i, i + 16);
        const tmp = slice.reduce((rv, num) => rv ^ num, 0); // XOR
        packed.push(tmp);
    }

    const hash = packed.map(num => leftPad(num.toString(16), 2, '0')).join('');

    return hash;
}
