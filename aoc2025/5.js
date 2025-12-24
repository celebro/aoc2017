const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
3-5
10-14
16-20
12-18

1
5
8
11
17
32
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

    let mode = 'ranges';
    let ranges = [];
    let list = [];

    for (let lineIx = 0; lineIx < lines.length; lineIx++) {
        let line = lines[lineIx];
        if (line === '') {
            mode = 'list';
            continue;
        }
        if (mode === 'ranges') {
            ranges.push(sscanf(line, '%d-%d'));
        } else if (mode === 'list') {
            list.push(parseInt(line));
        }
    }

    for (let id of list) {
        if (ranges.some((range) => id >= range[0] && id <= range[1])) {
            part1++;
        }
    }

    let ordered = [];
    for (let range of ranges) {
        addRange(range);
    }
    function addRange(range) {
        for (let i = 0; i < ordered.length; i++) {
            let r = ordered[i];
            if (!(range[1] < r[0] || range[0] > r[1])) {
                // overlaps, merge into r: merge, remove it from list, re-add so it can merge further with others
                r[0] = Math.min(r[0], range[0]);
                r[1] = Math.max(r[1], range[1]);
                ordered.splice(i, 1);
                addRange(r);
                return;
            }
        }
        // if didn't return yet, it's new non-overlapping range
        ordered.push(range);
    }

    for (let r of ordered) {
        part2 += r[1] - r[0] + 1;
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
