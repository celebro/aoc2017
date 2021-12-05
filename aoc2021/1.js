const fs = require('fs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `

`
].map((x) => x.trim());

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = 0;
    const lines = input
        .split('\n')
        .filter((line) => line.length)
        .map((x) => +x);

    for (let i = 0; i < lines.length; i++) {
        if (i >= 1) {
            if (lines[i] > lines[i - 1]) {
                part1++;
            }
        }

        if (i >= 3) {
            if (lines[i] > lines[i - 3]) {
                part2++;
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
