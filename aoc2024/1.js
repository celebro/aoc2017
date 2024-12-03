const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
3   4
4   3
2   5
1   3
3   9
3   3
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = 0;
    const lines = input.split('\n').filter((line) => line.length);

    let left = [];
    let right = [];
    let lookup = {};

    lines.forEach((line, ix) => {
        const [a, b] = sscanf(line, '%d %d');
        left.push(a);
        right.push(b);
        lookup[b] = (lookup[b] || 0) + 1;
    });

    left.sort((a, b) => a - b);
    right.sort((a, b) => a - b);

    for (let i = 0; i < left.length; i++) {
        part1 += Math.abs(left[i] - right[i]);
    }

    for (let i = 0; i < left.length; i++) {
        let a = left[i];
        let nums = lookup[a] || 0;
        part2 += a * nums;
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
