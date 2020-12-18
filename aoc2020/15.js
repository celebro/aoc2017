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
0,3,6
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

    const nums = lines[0].split(',').map((x) => +x);

    part1 = runNth([...nums], 2020);
    part2 = runNth([...nums], 30000000);

    return [part1, part2];
}

function runNth(nums, nth) {
    const map = new Int32Array(nth).fill(-1);
    for (let i = 0; i < nums.length - 1; i++) {
        map[nums[i]] = i;
    }

    for (let i = nums.length; i < nth; i++) {
        const last = nums[i - 1];
        const lastix = map[last];
        map[last] = i - 1;

        nums[i] = lastix === -1 ? 0 : i - 1 - lastix;

        // if (lastix === -1) {
        //     nums[i] = 0;
        // } else {
        //     nums[i] = i - 1 - lastix;
        // }
    }

    return nums[nums.length - 1];
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

for (let i = 0; i < 10; i++) {
    console.time('run');
    const result = run(input);
    console.timeEnd('run');
    console.log('result: ', result.join(' / '));
}
