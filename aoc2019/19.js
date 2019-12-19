const fs = require('fs');
const sscanf = require('scan.js').scan;
// @ts-ignore
const Grid = require('../utils/Grid');
// @ts-ignore
const List = require('../utils/LinkedList');
const Computer = require('./computer');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `

`
].map(x => x.trim());

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = undefined;
    const code = input.split('\n').filter(line => line.length)[0];

    for (let x = 0; x < 50; x++) {
        for (let y = 0; y < 50; y++) {
            if (isTractor(x, y)) {
                part1++;
            }
        }
    }

    function isTractor(x, y) {
        const [value] = Computer.runWithInputFull(code, [x, y]);
        return value === 1;
    }

    let x = 10;
    let y = 0;
    all: while (true) {
        while (isTractor(x, y)) {
            if (isTractor(x - 99, y + 99)) {
                break all;
            }
            x = x + 1;
        }
        while (!isTractor(x, y)) {
            y = y + 1;
        }
    }

    part2 = (x - 99) * 10000 + y;

    return [part1, part2];
}

for (const testInput of testInputs) {
    // const testResult = run(testInput);
    // console.log('test: ', testResult.join(' / '));
}

const result = run(input);
console.log('result: ', result.join(' / '));
