const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
L68
L30
R48
L5
R60
L55
L1
L99
R14
L82
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

    let dial = 50;

    for (let lineIx = 0; lineIx < lines.length; lineIx++) {
        let line = lines[lineIx];
        let rotation = line[0];
        let clicks = parseInt(line.slice(1), 10);
        if (rotation === 'L') {
            dial -= clicks;
            if (dial <= 0) {
                part2 += Math.floor(-dial / 100) + 1;
                // console.log(line, dial, ((dial % 100) + 100) % 100, part2);
                if (dial + clicks === 0) {
                    part2--;
                }
            }
        } else {
            dial += clicks;
            part2 += Math.floor(dial / 100);
            // console.log(line, dial, ((dial % 100) + 100) % 100, part2);
        }

        dial = dial % 100;

        if (dial < 0) {
            dial += 100;
        }

        if (dial === 0) {
            part1++;
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

// 5467 too low
