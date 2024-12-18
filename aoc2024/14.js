const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/FixedGrid');
const List = require('../utils/LinkedList');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    let lines = readInput(input);

    // let width = 11;
    // let height = 7;
    let width = 101;
    let height = 103;

    let midx = (width - 1) / 2;
    let midy = (height - 1) / 2;

    let robots = [];
    for (let lineIx = 0; lineIx < lines.length; lineIx++) {
        let line = lines[lineIx];
        let [x, y, vx, vy] = sscanf(line, 'p=%d,%d v=%d,%d');
        robots.push({ x, y, vx, vy });
    }

    let minSafetyFactor = Infinity;

    for (let i = 1; i < 10000; i++) {
        let quads = [0, 0, 0, 0];

        for (let robot of robots) {
            robot.x = mod(robot.x + robot.vx, width);
            robot.y = mod(robot.y + robot.vy, height);

            if (robot.x < midx && robot.y < midy) {
                quads[0]++;
            } else if (robot.x < midx && robot.y > midy) {
                quads[1]++;
            } else if (robot.x > midx && robot.y < midy) {
                quads[2]++;
            } else if (robot.x > midx && robot.y > midy) {
                quads[3]++;
            }
        }

        let safetyFactor = quads.reduce((a, b) => a * b);
        if (i === 100) {
            part1 = safetyFactor;
        }

        if (safetyFactor < minSafetyFactor) {
            minSafetyFactor = safetyFactor;
            console.log(i, safetyFactor);
            let grid = new Grid(width, height, '.');
            for (let robot of robots) {
                grid.set(robot.x, robot.y, '#');
            }
            grid.print((x) => x);
            part2 = i;
        }
    }

    return [part1, part2];
}

function mod(a, b) {
    return ((a % b) + b) % b;
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

// for (const testInput of testInputs) {
//     if (testInput) {
//         const testResult = run(testInput);
//         console.log('test: ', testResult.join(' / '));
//     }
// }

const result = run(input);
console.log('result: ', result.join(' / '));
