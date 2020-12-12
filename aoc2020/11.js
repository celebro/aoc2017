const fs = require('fs');
const sscanf = require('scan.js').scan;
// @ts-ignore
const Grid = require('../utils/Grid');
// @ts-ignore
const List = require('../utils/LinkedList');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL
`
].map((x) => x.trim());

const neighbours = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1]
];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = 0;
    const lines = input.split('\n').filter((line) => line.length);

    let grid = new Grid();

    lines.forEach((line, y) => {
        line.split('').forEach((char, x) => {
            grid.set(x, y, char);
        });
    });

    let change = false;
    let nextGrid = new Grid();
    do {
        change = false;
        grid.forEach((val, col, row) => {
            nextGrid.set(col, row, grid.get(col, row));

            if (val === '#' || val === 'L') {
                let occupied = 0;
                grid.forSlice(col - 1, row - 1, 3, 3, (v, c, r) => {
                    if (c !== col || r !== row) {
                        occupied += v === '#' ? 1 : 0;
                    }
                });
                if (val === 'L' && occupied === 0) {
                    nextGrid.set(col, row, '#');
                    change = true;
                } else if (val === '#' && occupied >= 4) {
                    nextGrid.set(col, row, 'L');
                    change = true;
                }
            }
        });
        [grid, nextGrid] = [nextGrid, grid];
    } while (change);

    grid.forEach((v) => {
        if (v === '#') {
            part1++;
        }
    });

    ///////////////
    grid = new Grid();
    lines.forEach((line, y) => {
        line.split('').forEach((char, x) => {
            grid.set(x, y, char);
        });
    });

    let iter = 0;
    do {
        iter++;
        change = false;
        grid.forEach((val, col, row) => {
            nextGrid.set(col, row, grid.get(col, row));
            if (val === '#' || val === 'L') {
                let sees = 0;

                for (const [dcol, drow] of neighbours) {
                    let i = 1;
                    while (true) {
                        let v = grid.get(col + dcol * i, row + drow * i);
                        if (v === '#') {
                            sees++;
                            break;
                        } else if (v === undefined || v === 'L') {
                            break;
                        }
                        i++;
                    }
                }

                if (val === 'L' && sees === 0) {
                    nextGrid.set(col, row, '#');
                    change = true;
                } else if (val === '#' && sees >= 5) {
                    nextGrid.set(col, row, 'L');
                    change = true;
                }
            }
        });
        [grid, nextGrid] = [nextGrid, grid];
        // grid.print((x) => x);
        // debugger;
    } while (change);

    grid.forEach((v) => {
        if (v === '#') {
            part2++;
        }
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
