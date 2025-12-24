const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
123 328  51 64
 45 64  387 23
  6 98  215 314
*   +   *   +
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

    let problems = [];

    for (let lineIx = 0; lineIx < lines.length; lineIx++) {
        let line = lines[lineIx];

        // p1
        let parts = line.split(' ');
        let index = 0;
        for (let p of parts) {
            if (p === '') continue;

            let problem = (problems[index] = problems[index] || { op: '', list: [], map: {} });
            index++;

            if (p === '') {
                continue;
            } else if (p === '+' || p === '*') {
                problem.op = p;
            } else {
                problem.list.push(parseInt(p));
            }
        }

        // p2
        index = 0;
        for (let i = 0; i < line.length; i++) {
            let char = line[i];
            if (char === ' ') {
                if (i > 0 && line[i - 1] !== ' ') {
                    index++;
                }
            } else if (char === '+' || char === '*') {
            } else {
                problems[index].map[i] = parseInt(char) + 10 * (problems[index].map[i] || 0);
            }
        }
    }

    for (let p of problems) {
        if (p.op === '+') {
            part1 += p.list.reduce((a, b) => a + b, 0);
            part2 += Object.values(p.map).reduce((a, b) => a + b, 0);
        } else if (p.op === '*') {
            part1 += p.list.reduce((a, b) => a * b, 1);
            part2 += Object.values(p.map).reduce((a, b) => a * b, 1);
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
