const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX
`
].map((x) => x.trim());

let dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [-1, -1],
    [1, -1],
    [-1, 1]
];

let diag = [
    [1, 1],
    [-1, -1],
    [1, -1],
    [-1, 1]
];
/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = 0;
    let lines = readInput(input);

    for (let y = 0; y < lines.length; y++) {
        let line = lines[y];
        for (let x = 0; x < line.length; x++) {
            if (line[x] !== 'X') {
                continue;
            }

            xmas: for (const [dx, dy] of dirs) {
                let search = 'XMAS';
                for (let charIx = 0; charIx < search.length; charIx++) {
                    let xx = x + dx * charIx;
                    let yy = y + dy * charIx;

                    if (lines[yy]?.[xx] !== search[charIx]) {
                        continue xmas;
                    }
                }
                part1++;
            }
        }
    }

    for (let y = 0; y < lines.length; y++) {
        let line = lines[y];
        for (let x = 0; x < line.length; x++) {
            if (line[x] !== 'A') {
                continue;
            }

            let found = 0;
            xmas: for (const [dx, dy] of diag) {
                let search = 'MAS';
                let xx = x + dx;
                let yy = y + dy;

                for (let charIx = 0; charIx < search.length; charIx++) {
                    if (lines[yy]?.[xx] !== search[charIx]) {
                        continue xmas;
                    }
                    xx -= dx;
                    yy -= dy;
                }
                found++;
            }

            if (found === 2) {
                part2++;
            }
        }
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

const result = run(input);
console.log('result: ', result.join(' / '));
