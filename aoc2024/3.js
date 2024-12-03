const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))
`,
    `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = undefined;
    let lines = readInput(input);

    let enabled = true;
    for (let lineIx = 0; lineIx < lines.length; lineIx++) {
        let line = lines[lineIx];

        let r = line.matchAll(/(mul\((\d{1,3}),(\d{1,3})\))|do\(\)|don't\(\)/g);
        for (let match of r) {
            // console.log(match[0], match[1], match[2], match[3]);
            if (match[0] === 'do()') {
                enabled = true;
            } else if (match[0] === "don't()") {
                enabled = false;
            } else if (enabled) {
                // console.log(match[1], match[2], match[3]);

                part1 += Number(match[2]) * Number(match[3]);
            }
        }
    }

    return [part1, part2];
}

/**
 * @param {string} input
 */
function readInput(input) {
    let lines = input.split('\n');
    let startIx = 0;
    let endIx = lines.length;
    while (lines[startIx] === '\n' || lines[startIx] === '') {
        startIx++;
    }
    while (lines[endIx - 1] === '\n' || lines[endIx - 1] === '') {
        endIx--;
    }
    return lines.slice(startIx, endIx);
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
