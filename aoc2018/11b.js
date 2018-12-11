// https://www.geeksforgeeks.org/submatrix-sum-queries/

const fs = require('fs');
const Grid = require('../utils/FixedGrid');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('11b.js', '11.txt'), 'utf8').trim();
} catch(e) {}

function print(grid) {
    for (let i = 1; i <= 20; i++) {
        let str = ''
        for (let j = 1; j <= 20; j++) {
            str += String(grid.get(j, i)).padStart(4, ' ');
        }
        console.log(str);
    }
    console.log();
}

function fill(input) {
    const grid = new Grid(301, 301, undefined, Int32Array);

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

    return grid;
}

function preprocess(grid) {
    const aux = new Grid(301, 301, undefined, Int32Array);

    for (let i = 1; i <= 300; i++) {
        for (let j = 1; j <= 300; j++) {
            const val = grid.get(i, j) + aux.get(i - 1, j) + aux.get(i, j - 1) - aux.get(i - 1, j - 1);
            aux.set(i, j, val);
        }
    }

    return aux;
}

function getMaxSquare(aux, size) {
    let max = -Infinity;
    let maxCoords = '';
    for (let i = 1; i <= 300 - size + 1; i++) {
        for (let j = 1; j <= 300 - size + 1; j++) {
            const xx = i + size - 1;
            const yy = j + size - 1;
            const sum = aux.get(xx, yy) - aux.get(i - 1, yy) - aux.get(xx, j - 1) + aux.get(i - 1, j - 1);
            if (sum > max) {
                max = sum;
                maxCoords = i + ',' + j;
            }
        }
    }

    return { max, maxCoords };
}

function run(input) {
    let part1 = undefined;
    let part2 = undefined;

    const grid = fill(input);
    const aux = preprocess(grid);

    let max = -Infinity;
    let maxCoords = '';
    for (let i = 1; i <= 300; i++) {
        const result = getMaxSquare(aux, i);
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

let testResult = run(18);
console.log('test: ', testResult.join(' / '));

testResult = run(42);
console.log('test: ', testResult.join(' / '));

console.time('time');
const result = run(+input);
console.timeEnd('time');
console.log('result: ', result.join(' / '));
