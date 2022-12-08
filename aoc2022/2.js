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
A Y
B X
C Z
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

    const shapeScore = {
        X: 1,
        Y: 2,
        Z: 3,
        A: 1,
        B: 2,
        C: 3
    };

    const outcomeScore = {
        A: {
            X: 3,
            Y: 6,
            Z: 0
        },
        B: {
            X: 0,
            Y: 3,
            Z: 6
        },
        C: {
            X: 6,
            Y: 0,
            Z: 3
        }
    };

    const select = {
        A: {
            X: 'C',
            Y: 'A',
            Z: 'B'
        },
        B: {
            X: 'A',
            Y: 'B',
            Z: 'C'
        },
        C: {
            X: 'B',
            Y: 'C',
            Z: 'A'
        }
    };

    const outcomeScore2 = {
        X: 0,
        Y: 3,
        Z: 6
    };

    lines.forEach((line, ix) => {
        const [opponent, me] = sscanf(line, '%s %s');
        part1 += shapeScore[me] + outcomeScore[opponent][me];
        part2 += shapeScore[select[opponent][me]] + outcomeScore2[me];
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
