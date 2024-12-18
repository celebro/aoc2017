const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0
`
].map((x) => x.trim());

const neighbours = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
];

/**
 * @param {string} input
 */
function run(input, isTest) {
    let part1 = undefined;
    let part2 = undefined;
    let lines = readInput(input);

    let max = isTest ? 6 : 70;
    let num = isTest ? 12 : 1024;

    let grid = new Grid();

    for (let x = 0; x <= max; x++) {
        for (let y = 0; y <= max; y++) {
            grid.set(x, y, { x, y, full: false });
        }
    }

    for (let lineIx = 0; lineIx < lines.length; lineIx++) {
        let line = lines[lineIx];
        let [x, y] = sscanf(line, '%d,%d');
        grid.get(x, y).full = true;

        let steps = getSteps(grid, max);

        if (lineIx === num - 1) {
            part1 = steps;
        }

        if (part1 && !steps) {
            part2 = `${x},${y}`;
            break;
        }
    }

    return [part1, part2];
}

function getSteps(grid, max) {
    let steps = new WeakMap();
    steps.set(grid.get(0, 0), 0);

    let nodes = [grid.get(0, 0)];

    while (nodes.length > 0) {
        let node = nodes.shift();
        let nodeSteps = steps.get(node);

        if (node.x === max && node.y === max) {
            return nodeSteps;
        }

        for (let [dx, dy] of neighbours) {
            let next = grid.get(node.x + dx, node.y + dy);
            if (!next || next.full || steps.has(next)) {
                continue;
            }

            steps.set(next, nodeSteps + 1);
            nodes.push(next);
        }
    }

    return undefined;
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
        const testResult = run(testInput, true);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
