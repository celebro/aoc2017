const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
`
].map((x) => x.trim());

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = 0;
    const lines = input.split('\n').filter((line) => line.length);

    const copies = {};

    lines.forEach((line, ix) => {
        copies[ix] = (copies[ix] || 0) + 1;
        const [idstr, datastr] = line.split(':');
        const [winningstr, mystr] = datastr.split('|');
        const winning = new Set(toList(winningstr));

        let score = 0;
        let count = 0;
        for (const my of toList(mystr)) {
            if (winning.has(my)) {
                score = score ? 2 * score : 1;
                count++;
            }
        }

        part1 += score;

        for (let i = 1; i <= count; i++) {
            copies[ix + i] = (copies[ix + i] || 0) + copies[ix];
        }
        part2 += copies[ix];
    });

    return [part1, part2];
}

function toList(str) {
    return str
        .trim()
        .split(/\s+/)
        .map((x) => parseInt(x));
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
