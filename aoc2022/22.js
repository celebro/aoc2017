const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8');
} catch (e) {}
const testInputs = [
    `        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5
`
];

const dirs = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1]
];

const right = 0;
const down = 1;
const left = 2;
const up = 3;

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n');

    const grid = new Grid();
    let mode = 1;
    let pathDesc = '';

    let startx = -1;
    let starty = -1;

    lines.forEach((line, iy) => {
        if (line === '') {
            mode = 2;
        } else if (mode === 1) {
            line.split('').forEach((char, ix) => {
                if (char === '.') {
                    grid.set(ix + 1, iy + 1, '.');
                    if (startx === -1) {
                        startx = ix + 1;
                        starty = iy + 1;
                    }
                } else if (char === '#') {
                    grid.set(ix + 1, iy + 1, '#');
                }
            });
        } else if (mode === 2 && line) {
            pathDesc = line;
        }
    });

    grid.print();

    function part(p) {
        let x = startx;
        let y = starty;
        let dirIx = right;
        let dir = dirs[dirIx];

        for (const inst of pathDesc.split(/(?<=\d)(?=[LR])|(?<=[LR])(?=\d)/)) {
            if (inst === 'L') {
                dirIx = (dirIx - 1 + 4) % 4;
                dir = dirs[dirIx];
            } else if (inst === 'R') {
                dirIx = (dirIx + 1) % 4;
                dir = dirs[dirIx];
            } else {
                const steps = +inst;
                for (let i = 0; i < steps; i++) {
                    let nextX = x + dir[0];
                    let nextY = y + dir[1];
                    let next = grid.get(nextX, nextY);
                    let nextIx = dirIx;

                    if (next === undefined) {
                        if (p === 1) {
                            while (grid.get(nextX - dir[0], nextY - dir[1])) {
                                nextX = nextX - dir[0];
                                nextY = nextY - dir[1];
                            }
                            next = grid.get(nextX, nextY);
                        } else {
                            // WARN - this is hardcoded for my input. I manually checked where each fold would end up
                            // proper solution would be 3D coordinates - add z=0, apply 90deg roation along each fold (the midpoint between eg 50 and 51 - 50.5)
                            // once those are 3d coordinates, after moving to coords with undefined value, check +-1 on axis other than current dir
                            //   dir = [1, 0, 0];
                            //   check [x, y z] + dir * 0.5 + ([0, 1, 0] | [0, -1, 0], | [0, 0, 1] | [0, 0, -1])
                            // Only one of those neighbours is populated, continue along that plane
                            //  1 1 1 1※
                            // 2       4
                            // 2       4
                            // 2       4
                            // 2       4
                            //  3 3 3 3
                            if (dirIx === right) {
                                if (y <= 50) {
                                    nextX = 100;
                                    nextY = 151 - y;
                                    nextIx = left;
                                } else if (y <= 100) {
                                    nextX = 100 + (y - 50);
                                    nextY = 50;
                                    nextIx = up;
                                } else if (y <= 150) {
                                    nextX = 150;
                                    nextY = 151 - y;
                                    nextIx = left;
                                } else {
                                    nextX = 50 + (y - 150);
                                    nextY = 150;
                                    nextIx = up;
                                }
                            } else if (dirIx === left) {
                                if (y <= 50) {
                                    nextX = 1;
                                    nextY = 151 - y;
                                    nextIx = right;
                                } else if (y <= 100) {
                                    nextX = y - 50;
                                    nextY = 101;
                                    nextIx = down;
                                } else if (y <= 150) {
                                    nextY = 151 - y;
                                    nextX = 51;
                                    nextIx = right;
                                } else {
                                    nextX = y - 150 + 50;
                                    nextY = 1;
                                    nextIx = down;
                                }
                            } else if (dirIx === down) {
                                if (x <= 50) {
                                    nextX = x + 100;
                                    nextY = 1;
                                    nextIx = down;
                                } else if (x <= 100) {
                                    nextY = x - 50 + 150;
                                    nextX = 50;
                                    nextIx = left;
                                } else {
                                    nextY = x - 100 + 50;
                                    nextX = 100;
                                    nextIx = left;
                                }
                            } else if (dirIx === up) {
                                if (x <= 50) {
                                    nextY = x + 50;
                                    nextX = 51;
                                    nextIx = right;
                                } else if (x <= 100) {
                                    nextY = x - 50 + 150;
                                    nextX = 1;
                                    nextIx = right;
                                } else {
                                    nextY = 200;
                                    nextX = x - 100;
                                    nextIx = up;
                                }
                            }
                            next = grid.get(nextX, nextY);
                        }
                    }

                    if (next === '#') {
                        break;
                    } else if (next === '.') {
                        x = nextX;
                        y = nextY;
                        dirIx = nextIx;
                        dir = dirs[dirIx];
                    } else {
                        throw new Error('Boom');
                    }
                }
            }
        }

        return 1000 * y + 4 * x + dirIx;
    }

    part1 = part(1);
    part2 = part(2);

    return [part1, part2];
}

for (const testInput of testInputs) {
    if (testInput) {
        // const testResult = run(testInput);
        // console.log('test: ', testResult.join(' / '));
    }
}

// 18350 too low
// 70206 too low

const result = run(input);
console.log('result: ', result.join(' / '));
