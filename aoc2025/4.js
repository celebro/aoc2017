const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.
`
].map((x) => x.trim());

const neighbours = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = 0;
    let lines = readInput(input);

    let map = new Grid();
    for (let lineIx = 0; lineIx < lines.length; lineIx++) {
        let line = lines[lineIx];
        for (let colIx = 0; colIx < line.length; colIx++) {
            map.set(colIx, lineIx, line[colIx]);
        }
    }

    map.forEach((value, x, y) => {
        if (value === '@') {
            let cnt = 0;
            map.forSlice(x - 1, y - 1, 3, 3, (v) => {
                cnt += v === '@' ? 1 : 0;
            });
            if (cnt <= 4) {
                part1++;
            }
        }
    });

    let again = true;
    while (again) {
        again = false;
        map.forEach((value, x, y) => {
            if (value === '@') {
                let cnt = 0;
                map.forSlice(x - 1, y - 1, 3, 3, (v) => {
                    cnt += v === '@' ? 1 : 0;
                });
                if (cnt <= 4) {
                    part2++;
                    map.set(x, y, 'x');
                    again = true;
                }
            }
        });
    }

    return [part1, part2];
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

// const result = run(input);
// console.log('result: ', result.join(' / '));
