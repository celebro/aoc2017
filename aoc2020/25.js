const fs = require('fs');
const sscanf = require('scan.js').scan;
// @ts-ignore
const Grid = require('../utils/Grid');
// @ts-ignore
const List = require('../utils/LinkedList');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
5764801
17807724
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter((line) => line.length);

    const publicKeys = [];
    lines.forEach((line, ix) => {
        publicKeys.push(+line);
    });

    const loopSize1 = reverseLoopSize(publicKeys[0]);
    const encryptionKey = transform(loopSize1, publicKeys[1]);
    part1 = encryptionKey;

    return [part1, part2];
}

function reverseLoopSize(publicKey) {
    let loopSize = 0;
    let currentKey = 1;

    while (currentKey !== publicKey) {
        loopSize++;
        currentKey = (currentKey * 7) % 20201227;
    }

    return loopSize;
}

function transform(loopSize, subject) {
    let result = 1;

    for (let i = 0; i < loopSize; i++) {
        result = (result * subject) % 20201227;
    }

    return result;
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
