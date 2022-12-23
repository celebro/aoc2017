const fs = require('fs');
const Grid = require('../utils/Grid');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>
`
].map((x) => x.trim());

const shapes = [
    `####`,
    `
.#.
###
.#.`,
    `
..#
..#
###`,
    `
#
#
#
#`,
    `
##
##`
].map((shapeStr) => {
    return shapeStr
        .split('\n')
        .filter((x) => !!x)
        .map((line) => {
            return line.split('').map((char) => {
                return char === '#' ? 1 : 0;
            });
        });
});

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const wind = input
        .split('\n')
        .filter((line) => line.length)[0]
        .split('')
        .map((x) => (x === '<' ? -1 : 1));

    let windIx = 0;
    const grid = new Grid();
    grid.set(0, 0, 0);
    grid.set(6, 0, 0);
    let shapeIx = 0;
    let height = [0];
    const visited = {};

    for (let iter = 1; iter <= 2022; iter++) {
        const shape = shapes[shapeIx++];
        if (shapeIx === shapes.length) shapeIx = 0;

        let x = 2;
        let y = grid.maxRow + 4;

        while (true) {
            const dx = wind[windIx++];
            if (windIx === wind.length) windIx = 0;

            if (!colision(x + dx, y, grid, shape)) {
                x += dx;
            }
            if (!colision(x, y - 1, grid, shape)) {
                y -= 1;
            } else {
                for (let i = shape.length - 1; i >= 0; i--) {
                    for (let j = 0; j < shape[i].length; j++) {
                        if (shape[i][j]) {
                            grid.set(x + j, y + shape.length - 1 - i, 1);
                        }
                    }
                }
                break;
            }
        }

        //////////////////////
        if (!part2) {
            const currentHeight = grid.maxRow;
            height.push(currentHeight);

            let gridKey = [];
            for (let i = grid.maxRow; i > grid.maxRow - 20 && i > 0; i--) {
                let num = 0;
                for (let j = 0; j < 7; j++) {
                    num << 1;
                    if (grid.get(j, i)) {
                        num++;
                    }
                }
                gridKey.push(num);
            }

            const key = `${shapeIx}-${windIx}-${gridKey}`;
            if (visited[key]) {
                const last = visited[key];
                const repeatDiff = currentHeight - last.height;
                const period = iter - last.iter;
                const repeats = Math.floor((1000000000000 - iter) / period);
                const remainingSteps = (1000000000000 - iter) % period;
                const remainderHeight = height[last.iter + remainingSteps] - last.height;
                part2 = currentHeight + repeats * repeatDiff + remainderHeight;
            }
            visited[key] = { iter, height: currentHeight };
        }
    }

    part1 = grid.maxRow;

    return [part1, part2];
}

function colision(x, y, grid, shape) {
    if (x < 0) {
        return true;
    }
    if (x + shape[0].length > 7) {
        return true;
    }
    if (y === 0) {
        return true;
    }

    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
            if (shape[i][j]) {
                if (grid.get(x + j, y + shape.length - 1 - i)) {
                    return true;
                }
            }
        }
    }
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
