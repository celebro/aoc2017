const fs = require('fs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
Time:      7  15   30
Distance:  9  40  200
`
].map((x) => x.trim());

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter((line) => line.length);

    let time1 = [];
    let record1 = [];

    let time2 = [];
    let record2 = [];
    lines.forEach((line) => {
        const numbers1 = line.split(':').at(1).trim().split(/\s+/).map(Number);
        const numbers2 = [Number(line.split(':').at(1).trim().replaceAll(' ', ''))];

        if (!numbers1.length) {
            return;
        }

        if (time1.length === 0) {
            time1 = numbers1;
            time2 = numbers2;
        } else {
            record1 = numbers1;
            record2 = numbers2;
        }
    });

    part1 = calc(time1, record1);
    part2 = calc(time2, record2);

    return [part1, part2];
}

function calc(time, record) {
    const ways = [];
    for (let i = 0; i < time.length; i++) {
        const t = time[i];
        const rec = record[i];

        let min = (t - Math.sqrt(t ** 2 - 4 * rec)) / 2;
        min = min === Math.ceil(min) ? min + 1 : Math.ceil(min);
        let max = (t + Math.sqrt(t ** 2 - 4 * rec)) / 2;
        max = max === Math.floor(max) ? max - 1 : Math.floor(max);
        ways[i] = max - min + 1;
    }

    return ways.reduce((a, b) => a * b);
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
