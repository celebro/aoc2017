const fs = require('fs');
const Grid = require('../utils/Grid');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch(e) {}

function foo(grid, sums, size) {
    let max = -Infinity;
    let maxCoords = '';
    for (let x = 1; x <= 300 - size + 1; x++) {
        for (let y = 1; y <= 300 - size + 1; y++) {
            let sum;
            if (size === 1) {
                sum = grid.get(x, y);
            } else {
                sum = sums.get(x, y);
                const xx = x + size - 1;
                for (let i = 0; i < size; i++) {
                    sum += grid.get(xx, y + i);
                }
                const yy = y + size - 1;
                for (let j = 0; j < size - 1; j++) {
                    sum += grid.get(x + j, yy);
                }
            }

            sums.set(x, y, sum);

            if (sum > max) {
                max = sum;
                maxCoords = x + ',' + y;
            }
        }
    }
    return { max, maxCoords };
}

function run(input) {
    let part1 = undefined;
    let part2 = undefined;

    const grid = new Grid();

    for (let i = 1; i <= 300; i++) {
        for (let j = 1; j <= 300; j++) {
            let val = i + 10;
            val *= j;
            val += input;
            val *= i + 10;
            val = Math.floor(val / 100) % 10;
            val -= 5;

            grid.set(i, j, val);
        }
    }

    let max = -Infinity;
    let maxCoords = '';
    const sums = new Grid();
    for (let i = 1; i <= 300; i++) {
        const result = foo(grid, sums, i);
        if (result.max > max) {
            max = result.max;
            maxCoords = result.maxCoords + ',' + i;
        }
        if (i === 3) {
            part1 = result.maxCoords;
        }
    }
    part2 = maxCoords

    return [part1, part2];
}



console.time('time');
const result = run(+input);
console.timeEnd('time');
console.log('result: ', result.join(' / '));

let testResult = run(18);
console.log('test: ', testResult.join(' / '));

testResult = run(42);
console.log('test: ', testResult.join(' / '));
