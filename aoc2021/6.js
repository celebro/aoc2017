const fs = require('fs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
3,4,3,1,2
`
].map((x) => x.trim());

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;

    let fishInput = input
        .split('\n')
        .filter((line) => line.length)[0]
        .split(',')
        .map((x) => +x);

    const fish = Array(9).fill(0);
    for (const counter of fishInput) {
        fish[counter]++;
    }

    let zero = 0;
    for (let day = 1; day <= 256; day++) {
        const six = zero + 7 > 8 ? zero + 7 - 9 : zero + 7;
        fish[six] += fish[zero];
        zero = zero === 8 ? 0 : zero + 1;

        if (day === 80) {
            part1 = fish.reduce((a, b) => a + b);
        }
    }

    part2 = fish.reduce((a, b) => a + b);

    return [part1, part2];
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

console.time('run');
const result = run(input);
console.timeEnd('run');
console.log('result: ', result.join(' / '));
