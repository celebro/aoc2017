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

`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n');

    const elves = [[]];

    lines.forEach((line, ix) => {
        if (line) {
            const [cal] = sscanf(line, '%d');
            elves.at(-1).push(cal);
        } else {
            elves.push([]);
        }
    });

    const sums = elves.map((calList) => calList.reduce((a, b) => a + b));

    sums.sort((a, b) => b - a);

    part1 = sums[0];
    part2 = sums[0] + sums[1] + sums[2];

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
