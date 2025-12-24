const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
987654321111111
811111111111119
234234234234278
818181911112111
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

    function p1(line) {
        let n0 = +line[0];
        let n1 = +line[1];

        for (let i = 2; i < line.length; i++) {
            let next = +line[i];

            if (n1 > n0) {
                n0 = n1;
                n1 = next;
            } else if (next > n1) {
                n1 = next;
            }
        }
        part1 += n0 * 10 + n1;
    }

    /**
     *
     * @param {string} line
     */
    function p2(line) {
        let stack = line
            .split('')
            .slice(0, 12)
            .map((x) => +x);

        for (let i = 12; i < line.length; i++) {
            let next = +line[i];
            stack.push(next);

            for (let j = 0; j < 12; j++) {
                if (stack[j] < stack[j + 1]) {
                    stack.splice(j, 1);
                    stack.push(+next);
                    break;
                }
            }
            if (stack.length > 12) {
                stack.pop();
            }
        }

        let n = +stack.join('');
        part2 += n;
    }

    for (let lineIx = 0; lineIx < lines.length; lineIx++) {
        let line = lines[lineIx];

        p1(line);
        p2(line);
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
