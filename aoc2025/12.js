const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = undefined;
    let lines = readInput(input);

    for (let lineIx = 0; lineIx < lines.length; lineIx++) {
        let line = lines[lineIx];
        if (line.length > 5) {
            let [dim, list] = line.split(': ');
            let [w, h] = sscanf(dim, '%dx%d');
            w = Math.ceil(w / 3);
            h = Math.ceil(h / 3);
            let nums = list.split(' ').map((x) => parseInt(x, 10));
            if (nums.reduce((a, b) => a + b, 0) <= w * h) {
                part1++;
            }
        }
    }

    // 448 too low

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
