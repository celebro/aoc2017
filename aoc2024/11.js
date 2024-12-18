const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
0 1 10 99 999
`,
    `125 17`
].map((x) => x.trim());

/**
 * @param {string} input
 */
function run(input) {
    let part1 = blinkTimes(input, 25);
    let part2 = blinkTimes(input, 75);
    return [part1, part2];
}

function blinkTimes(input, times) {
    let line = readInput(input)[0];

    let nums = {};
    for (let num of line.split(' ')) {
        nums[num] = (nums[num] || 0) + 1;
    }

    for (let i = 0; i < times; i++) {
        let next = {};
        for (let [num, count] of Object.entries(nums)) {
            for (let n of blink(Number(num))) {
                next[n] = (next[n] || 0) + count;
            }
        }

        nums = next;
    }

    return Object.values(nums).reduce((a, b) => a + b);
}

function blink(num) {
    if (num === 0) {
        return [1];
    }
    let digits = Math.floor(Math.log10(num)) + 1;
    if (digits % 2 === 0) {
        let high = Math.floor(num / 10 ** (digits / 2));
        let low = num % 10 ** (digits / 2);
        return [high, low];
    }

    return [num * 2024];
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
