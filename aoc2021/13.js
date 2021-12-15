const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n');

    const map = new Grid(() => 0);
    const folds = [];

    let mode = 1;
    lines.forEach((line) => {
        if (line === '') {
            mode++;
        } else if (mode === 1) {
            const [x, y] = line.split(',').map((x) => +x);
            map.set(x, y, 1);
        } else {
            const [axis, value] = sscanf(line, 'fold along %s')[0].split('=');
            folds.push({ axis, value: +value });
        }
    });

    map.minCol = 0;
    map.minRow = 0;

    for (const { axis, value } of folds) {
        if (axis === 'y') {
            map.forSlice(0, 0, map.maxCol + 1, value, (node, x, y) => {
                map.set(x, y, node + map.get(x, 2 * value - y));
            });
            map.maxRow = value - 1;
        } else {
            map.forSlice(0, 0, value, map.maxRow + 1, (node, x, y) => {
                map.set(x, y, node + map.get(2 * value - x, y));
            });
            map.maxCol = value - 1;
        }

        if (part1 === undefined) {
            part1 = 0;
            map.forEach((x) => {
                if (x > 0) {
                    part1++;
                }
            });
        }
    }

    map.print((x) => (x ? '#' : '.'));

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
