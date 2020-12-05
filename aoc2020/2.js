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
1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc
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
        const [min, max, char, pwd] = sscanf(line.replace(':', ''), '%d-%d %s %s');

        let count = 0;
        for (const c of pwd.split('')) {
            if (c === char) {
                count++;
            }
        }
        if (count >= min && count <= max) {
            part1++;
        }

        count = 0;
        if (pwd[min - 1] === char) {
            count++;
        }
        if (pwd[max - 1] === char) {
            count++;
        }
        if (count === 1) {
            part2++;

            // 437 too low
        }
    });

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
