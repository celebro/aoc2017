const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279
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

    let i = 0;

    while (lines[i]) {
        let [Ax, Ay] = sscanf(lines[i], 'Button A: X+%d, Y+%d');
        let [Bx, By] = sscanf(lines[i + 1], 'Button B: X+%d, Y+%d');
        let [Px, Py] = sscanf(lines[i + 2], 'Prize: X=%d, Y=%d');

        Px += 10000000000000;
        Py += 10000000000000;

        // console.log(lines[i], lines[i + 1], lines[i + 2]);
        i = i + 4;

        let b = (Ax * Py - Ay * Px) / (Ax * By - Ay * Bx);
        let a = (Px - b * Bx) / Ax;

        if (a === Math.floor(a) && b === Math.floor(b)) {
            part1 += 3 * a + b;
            // console.log(a, b, '=>', 3 * a + b);
        } else {
            // console.log('no solution', a, b);
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
