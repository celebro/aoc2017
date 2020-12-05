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
1721
979
366
299
675
1456
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input
        .split('\n')
        .filter((line) => line.length)
        .map((x) => +x);

    for (let i = 0; i < lines.length; i++) {
        const a = lines[i];
        for (let j = i; j < lines.length; j++) {
            const b = lines[j];

            if (a + b === 2020) {
                part1 = a * b;
            }

            for (let k = j; k < lines.length; k++) {
                const c = lines[k];
                if (a + b + c === 2020) {
                    part2 = a * b * c;
                }
            }
        }
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
