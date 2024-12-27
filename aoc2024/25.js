const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
#####
.####
.####
.####
.#.#.
.#...
.....

#####
##.##
.#.##
...##
...#.
...#.
.....

.....
#....
#....
#...#
#.#.#
#.###
#####

.....
.....
#.#..
###..
###.#
###.#
#####

.....
.....
.....
#....
#.#..
#.#.#
#####
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = undefined;
    let lines = readInput(input);

    let locks = [];
    let keys = [];

    let lockOrKey;
    let data = [];
    let dataLine = 0;
    for (let lineIx = 0; lineIx < lines.length; lineIx++) {
        let line = lines[lineIx];
        if (line === '') {
            lockOrKey = undefined;
            continue;
        }

        if (!lockOrKey && line[0] === '#') {
            lockOrKey = 'lock';
            data = [];
            dataLine = 0;
            locks.push(data);
        } else if (!lockOrKey && line[0] === '.') {
            lockOrKey = 'key';
            data = [];
            dataLine = 0;
            keys.push(data);
        } else {
            dataLine++;
        }

        for (let p = 0; p < line.length; p++) {
            let char = line[p];

            if (lockOrKey === 'lock') {
                if (char === '#') {
                    data[p] = dataLine;
                }
            }

            if (lockOrKey === 'key') {
                if (char === '.') {
                    data[p] = 5 - dataLine;
                }
            }
        }
    }

    for (let lock of locks) {
        for (let key of keys) {
            let fit = true;
            for (let i = 0; i < 5; i++) {
                if (lock[i] + key[i] > 5) {
                    fit = false;
                    break;
                }
            }
            if (fit) {
                part1++;
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
