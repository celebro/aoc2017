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
mjqjpqmgbljsphdztnvjfqwrcgsmlb
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const line = input.split('\n').filter((line) => line.length)[0];

    for (let i = 3; i < line.length; i++) {
        const last4 = line.slice(i - 3, i + 1);
        const unique = new Set(last4).size;
        if (unique === 4) {
            part1 = i + 1;
            break;
        }
    }

    for (let i = 13; i < line.length; i++) {
        const last14 = line.slice(i - 13, i + 1);
        const unique = new Set(last14).size;
        if (unique === 14) {
            part2 = i + 1;
            break;
        }
    }

    return [part1, part2];
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
