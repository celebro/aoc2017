const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45
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

    lines.forEach((line, ix) => {
        const nums = line.split(' ').map(Number);
        const [t1, t2] = extrapolate(nums);
        part1 += t1;
        part2 += t2;
    });

    return [part1, part2];
}

/**
 * @param {number[]} nums
 */
function extrapolate(nums) {
    const stack = [nums];
    while (true) {
        const diff = diffs(stack.at(-1));
        if (diff) {
            stack.push(diff);
        } else {
            break;
        }
    }

    stack.reverse();

    let t1 = 0;
    for (const diff of stack) {
        t1 = diff.at(-1) + t1;
    }

    let t2 = 0;
    for (const diff of stack) {
        t2 = diff.at(0) - t2;
    }

    return [t1, t2];
}

/**
 * @param {number[]} nums
 */
function diffs(nums) {
    let zeros = true;
    const diff = [];
    for (let i = 0; i < nums.length - 1; i++) {
        const d = nums[i + 1] - nums[i];
        diff.push(d);
        if (d !== 0) {
            zeros = false;
        }
    }

    return zeros ? undefined : diff;
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
