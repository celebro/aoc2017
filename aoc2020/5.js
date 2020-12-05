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
FBFBBFFRLR
BFFFBBFRRR
FFFBBBFRRR
BBFFBBFRLL
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = undefined;
    const lines = input.split('\n').filter((line) => line.length);

    const ids = [];

    lines.forEach((line, ix) => {
        let row1 = 0;
        let row2 = 127;

        let col1 = 0;
        let col2 = 7;

        for (const char of line) {
            if (char === 'F') {
                row2 -= (row2 - row1 + 1) / 2;
            } else if (char === 'B') {
                row1 += (row2 - row1 + 1) / 2;
            } else if (char === 'R') {
                col1 += (col2 - col1 + 1) / 2;
            } else if (char === 'L') {
                col2 -= (col2 - col1 + 1) / 2;
            }
        }

        const id = row1 * 8 + col1;
        ids[id] = true;

        if (id > part1) {
            part1 = id;
        }
    });

    for (let i = 1; i < ids.length - 1; i++) {
        if (!ids[i] && ids[i - 1] && ids[i + 1]) {
            part2 = i;
            console.log(i);
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
