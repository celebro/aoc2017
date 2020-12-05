const fs = require('fs');
const Grid = require('../utils/FixedGrid');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}

/**
 * @param {string} input
 */
function run(input) {
    let part1 = runPart(input, 1);
    let part2 = runPart(input, 2);

    return [part1, part2];
}

function runPart(input, part) {
    const lines = input.split('\n').filter((line) => line.length);

    let grid = new Grid(100, 100, 0);
    let next = new Grid(100, 100, 0);

    function isCorner(x, y) {
        if ((x === 0 && y === 0) || (x === 0 && y === 99) || (x === 99 && y === 0) || (x === 99 && y === 99)) {
            return true;
        }
        return false;
    }

    lines.forEach((line, ix) => {
        line.split('').forEach((char, jx) => {
            let value = char === '#' ? 1 : 0;
            if (part === 2 && isCorner(ix, jx)) {
                value = 1;
            }
            grid.set(jx, ix, value);
        });
    });

    for (let iter = 0; iter < 100; iter++) {
        grid.forEach((val, x, y) => {
            let sum = -val;
            grid.forSlice(x - 1, y - 1, 3, 3, (v) => {
                sum += v;
            });
            if (val === 1) {
                next.set(x, y, sum === 2 || sum === 3 ? 1 : 0);
            } else {
                next.set(x, y, sum === 3 ? 1 : 0);
            }
            if (part === 2 && isCorner(x, y)) {
                next.set(x, y, 1);
            }
        });

        let tmp = grid;
        grid = next;
        next = tmp;
    }

    let sum = 0;
    grid.forEach((val) => {
        sum += val;
    });

    return sum;
}

const result = run(input);
console.log('result: ', result.join(' / '));
