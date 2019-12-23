const fs = require('fs');
const gcd = require('../utils/gcd');
/* global BigInt */
let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
    cut 3
`,
    `
cut 2
deal with increment 3
`,
    `
deal with increment 7
deal into new stack
`,
    `
cut 6
deal with increment 7
deal into new stack
`,
    `
deal with increment 7
deal with increment 9
cut -2
`,
    `deal into new stack
cut -2
deal with increment 7
cut 8
cut -4
deal with increment 7
cut 3
deal with increment 9
deal with increment 3
cut -1
`
].map(x => x.trim());

function reduceOperations(input, length) {
    const len = BigInt(length);
    let factor = 1n;
    let offset = 0n;

    for (const line of input.split('\n').filter(line => line.length)) {
        const parts = line.split(' ');
        if (parts[0] === 'cut') {
            offset = offset - BigInt(parts[1]);
        } else if (parts[2] === 'new') {
            factor = -factor;
            offset = -offset - 1n;
        } else if (parts[2] === 'increment') {
            const inc = BigInt(parts[3]);
            factor = (inc * factor) % len;
            offset = (inc * offset) % len;
        }
    }

    return [factor, offset];
}

/**
 *
 * @param {bigint} a
 * @param {bigint} m
 */
function modinv(a, m) {
    const [g, x, y] = egcd(a, m);
    if (g !== 1n) {
        throw new Error(`modinv does not exist ${a} ${m}`);
    }
    return x % m;
}

/**
 *
 * @param {bigint} a
 * @param {bigint} b
 * @returns {[bigint, bigint, bigint]}
 */
function egcd(a, b) {
    // return (g, x, y) such that a*x + b*y = g = gcd(a, b)
    if (a === 0n) {
        return [b, 0n, 1n];
    } else {
        const [g, y, x] = egcd(b % a, a);
        return [g, x - (b / a) * y, y];
    }
}

/**
 *
 * @param {bigint} factor
 * @param {bigint} offset
 * @param {bigint} times
 * @param {bigint} mod
 */
function repeatFunction(factor, offset, times, mod) {
    if (times === 1n) {
        return [factor, offset];
    } else if (times % 2n === 0n) {
        const a2 = (factor * factor) % mod;
        const b2 = (((factor * offset) % mod) + offset) % mod;
        return repeatFunction(a2, b2, times / 2n, mod);
    } else {
        const [an, bn] = repeatFunction(factor, offset, times - 1n, mod);
        const newFactor = (factor * an) % mod;
        const newOffset = (((factor * bn) % mod) + offset) % mod;
        return [newFactor, newOffset];
    }
}

/**
 * @param {string} input
 */
function run(input, numCards = 10007, position = 2020) {
    let part1 = undefined;
    let part2 = undefined;

    let [factor, offset] = reduceOperations(input, numCards);
    part1 = (factor * 2019n + offset) % BigInt(numCards);

    // part2
    let length = 119315717514047n;
    let times = 101741582076661n;

    [factor, offset] = reduceOperations(input, length);
    [factor, offset] = repeatFunction(factor, offset, times, length);

    const invFactor = modinv(factor, length);
    const invOffset = (-offset * invFactor) % length;

    part2 = (invFactor * BigInt(position) + invOffset) % length;
    if (part2 < 0) {
        part2 = part2 + length;
    }

    return [part1, part2];
}

for (const testInput of testInputs) {
    // const testResult = run(testInput, 10, 5);
    // console.log('test: ', testResult.join(' / '));
    console.log();
}

const result = run(input);
console.log('result: ', result.join(' / '));
