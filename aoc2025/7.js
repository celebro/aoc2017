/* eslint-disable no-inner-declarations */
/* eslint-disable no-unused-vars */
const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............
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

    let map = new Grid();
    let beams = new Set();
    let quant = new Map();
    for (let row = 0; row < lines.length; row++) {
        let line = lines[row];
        for (let col = 0; col < line.length; col++) {
            map.set(col, row, line[col]);
            if (line[col] === 'S') {
                beams.add(col);
                quant.set(col, 1);
            }
        }
    }

    // p1
    for (let row = 1; row < lines.length; row++) {
        let newBeams = new Set();
        for (let beam of beams) {
            let cell = map.get(beam, row);
            if (cell === '^') {
                part1++;
                newBeams.add(beam - 1);
                newBeams.add(beam + 1);
            } else {
                newBeams.add(beam);
            }
        }
        beams = newBeams;
    }

    for (let row = 1; row < lines.length; row++) {
        let newQuant = new Map();

        function add(key, value) {
            if (newQuant.has(key)) {
                newQuant.set(key, newQuant.get(key) + value);
            } else {
                newQuant.set(key, value);
            }
        }

        for (let q of quant) {
            let cell = map.get(q[0], row);
            if (cell === '^') {
                add(q[0] - 1, q[1]);
                add(q[0] + 1, q[1]);
            } else {
                add(q[0], q[1]);
            }
        }

        quant = newQuant;
    }

    part2 = quant.values().reduce((a, b) => a + b, 0);

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
