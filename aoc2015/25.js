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

    let row, column;
    lines.forEach((line, ix) => {
        [row, column] = sscanf(line, 'To continue, please consult the code grid in the manual.  Enter the code at row %d, column %d.');
    });

    let x = 1;
    let y = 1;
    let maxy = 1;
    let code = 20151125;

    while (x !== column || y !== row) {
        if (y === 1) {
            y = maxy + 1;
            maxy = y;
            x = 1;
        } else {
            x = x + 1;
            y = y - 1;
        }

        code = (code * 252533) % 33554393;
    }
    console.log(x, y, code);

    part1 = code;
    // 19749359 too low

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
