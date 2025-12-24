const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
11-22,95-115,998-1012,1188511880-1188511890,222220-222224,
1698522-1698528,446443-446449,38593856-38593862,565653-565659,
824824821-824824827,2121212118-2121212124
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

    for (let lineIx = 0; lineIx < lines.length; lineIx++) {
        let line = lines[lineIx];
        let pairs = line.split(',');
        for (let pair of pairs) {
            let [min, max] = pair.split('-').map((x) => parseInt(x, 10));
            for (let n = min; n <= max; n++) {
                let str = n.toString();
                let len = str.length;
                if (len % 2 === 0) {
                    if (str.slice(0, len / 2) === str.slice(len / 2)) {
                        part1 += n;
                    }
                }

                // p2
                for (let i = 1; i <= len / 2; i++) {
                    if (len % i !== 0) {
                        continue;
                    }

                    let segment = str.slice(0, i);
                    let repeated = segment.repeat(len / i);
                    if (repeated === str) {
                        part2 += n;
                        break;
                    }
                }
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
