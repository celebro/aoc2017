const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
1=-0-2
12111
2=0=
21
2=01
111
20012
112
1=-1=
1-12
12
1=
122
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = '';
    let part2 = '*';
    const lines = input.split('\n').filter((line) => line.length);

    let sum = 0;
    lines.forEach((line, ix) => {
        let value = 0;
        line.split('')
            .reverse()
            .forEach((char, i) => {
                const power = 5 ** i;
                let place = 0;
                if (char === '-') {
                    place = -1;
                } else if (char === '=') {
                    place = -2;
                } else {
                    place = +char;
                }
                value += power * place;
            });
        sum += value;
        // console.log(line, value);
    });

    part1 = '';
    let over = 0;
    while (sum) {
        let v = (sum + over) % 5;
        sum = Math.floor((sum + over) / 5);
        over = 0;

        if (v <= 2) {
            part1 = String(v) + part1;
        } else if (v === 3) {
            part1 = '=' + part1;
            over = 1;
        } else if (v === 4) {
            part1 = '-' + part1;
            over = 1;
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
