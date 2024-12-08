/* eslint-disable no-inner-declarations */
const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = 0;
    let lines = readInput(input);

    for (let lineIx = 0; lineIx < lines.length; lineIx++) {
        let line = lines[lineIx];

        let test = +line.split(':')[0];
        let nums = line
            .split(': ')[1]
            .split(' ')
            .map((x) => +x);

        if (validate1(test, nums)) {
            part1 += test;
        }

        if (validate2(test, nums)) {
            part2 += test;
        }
    }

    return [part1, part2];
}

function validate1(test, nums) {
    let count = 0;
    function next(temp, ix) {
        if (ix === nums.length) {
            if (temp === test) {
                count++;
            }
            return;
        }

        if (temp > test) {
            return;
        }

        next(temp + nums[ix], ix + 1);
        next(temp * nums[ix], ix + 1);
    }

    next(nums[0], 1);

    return count > 0;
}

function validate2(test, nums) {
    let count = 0;
    function next(temp, ix) {
        if (ix === nums.length) {
            if (temp === test) {
                count++;
            }
            return;
        }

        if (temp > test) {
            return;
        }

        next(temp + nums[ix], ix + 1);
        next(temp * nums[ix], ix + 1);
        next(+`${temp}${nums[ix]}`, ix + 1);
    }

    next(nums[0], 1);

    return count > 0;
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
