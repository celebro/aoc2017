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
30373
25512
65332
33549
35390
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

    const grid = new Grid();
    lines.forEach((line, ix) => {
        line.split('').forEach((num, iy) => {
            grid.set(iy, ix, +num);
        });
    });

    const max = Math.max(grid.maxCol, grid.maxRow);

    grid.forEach((v, col, row) => {
        let leftVisible = true,
            rightVisible = true,
            upVisible = true,
            downVisible = true;
        let leftDist = col,
            rightDist = grid.maxCol - col,
            upDist = row,
            downDist = grid.maxRow - row;
        for (let i = 0; i <= max; i++) {
            if (grid.get(i, row) >= v) {
                if (i < col) {
                    leftVisible = false;
                    leftDist = Math.min(leftDist, col - i);
                }
                if (i > col) {
                    rightVisible = false;
                    rightDist = Math.min(rightDist, i - col);
                }
            }
            if (grid.get(col, i) >= v) {
                if (i < row) {
                    upVisible = false;
                    upDist = Math.min(upDist, row - i);
                }
                if (i > row) {
                    downVisible = false;
                    downDist = Math.min(downDist, i - row);
                }
            }
        }

        if (leftVisible || rightVisible || upVisible || downVisible) {
            part1++;
        }
        const score = leftDist * rightDist * upDist * downDist;
        part2 = Math.max(score, part2);
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
