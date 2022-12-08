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

    grid.forEach((v, col, row) => {
        let visible = v1(v, col, row) || v2(v, col, row) || v3(v, col, row) || v4(v, col, row);
        if (visible) {
            part1++;
        }

        const score = s1(v, col, row) * s2(v, col, row) * s3(v, col, row) * s4(v, col, row);
        part2 = Math.max(score, part2);
    });

    function v1(v, col, row) {
        for (let i = 0; i < col; i++) {
            if (grid.get(i, row) >= v) {
                return false;
            }
        }
        return true;
    }
    function v2(v, col, row) {
        for (let i = col + 1; i <= grid.maxCol; i++) {
            if (grid.get(i, row) >= v) {
                return false;
            }
        }
        return true;
    }
    function v3(v, col, row) {
        for (let i = 0; i < row; i++) {
            if (grid.get(col, i) >= v) {
                return false;
            }
        }
        return true;
    }
    function v4(v, col, row) {
        for (let i = row + 1; i <= grid.maxRow; i++) {
            if (grid.get(col, i) >= v) {
                return false;
            }
        }
        return true;
    }

    function s1(v, col, row) {
        let sum = 0;
        for (let i = col - 1; i >= 0; i--) {
            sum++;
            if (grid.get(i, row) >= v) {
                break;
            }
        }
        return sum;
    }
    function s2(v, col, row) {
        let sum = 0;
        for (let i = col + 1; i <= grid.maxCol; i++) {
            sum++;
            if (grid.get(i, row) >= v) {
                break;
            }
        }
        return sum;
    }
    function s3(v, col, row) {
        let sum = 0;
        for (let i = row - 1; i >= 0; i--) {
            sum++;
            if (grid.get(col, i) >= v) {
                break;
            }
        }
        return sum;
    }
    function s4(v, col, row) {
        let sum = 0;
        for (let i = row + 1; i <= grid.maxRow; i++) {
            sum++;
            if (grid.get(col, i) >= v) {
                break;
            }
        }
        return sum;
    }

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
