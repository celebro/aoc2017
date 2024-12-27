const fs = require('fs');
const Grid = require('../utils/Grid');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############
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
function run(input) {
    let part1 = 0;
    let part2 = 0;
    let lines = readInput(input);

    let grid = new Grid();
    let start, end;

    for (let y = 0; y < lines.length; y++) {
        for (let x = 0; x < lines[y].length; x++) {
            let char = lines[y][x];
            let node = {
                x,
                y,
                wall: char === '#',
                wallDx: 0,
                wallDy: 0,
                wallParent: null,
                steps: -1
            };

            if (char === 'S') {
                start = node;
            } else if (char === 'E') {
                end = node;
            }

            grid.set(x, y, node);
        }
    }

    grid.print((x) => (x.wall ? '#' : '.'));

    let queue = [start];
    start.steps = 0;
    let walls = [];

    for (let i = 0; i < queue.length; i++) {
        let node = queue[i];
        if (node === end) {
            break;
        }

        for (let [dx, dy] of neighbours) {
            let x = node.x + dx;
            let y = node.y + dy;
            let next = grid.get(x, y);

            if (!next || next.steps !== -1) {
                continue;
            }

            next.steps = node.steps + 1;
            if (next.wall) {
                next.wallDx = dx;
                next.wallDy = dy;
                next.wallParent = node;
                walls.push(next);
            } else {
                queue.push(next);
            }
        }
    }

    for (let wall of walls) {
        let next = grid.get(wall.x + wall.wallDx, wall.y + wall.wallDy);
        if (next && !next.wall) {
            let saved = next.steps - wall.steps - 1;
            if (saved >= 100) {
                part1++;
            }
        }
    }

    grid.forEach((gridPosition) => {
        if (gridPosition.wall || gridPosition === end || gridPosition.steps === -1) {
            return;
        }

        let queue = [gridPosition];
        let cheatSteps = new WeakMap();
        cheatSteps.set(gridPosition, 0);
        let counted = new Set();

        for (let i = 0; i < queue.length; i++) {
            let node = queue[i];
            let steps = cheatSteps.get(node);
            if (steps >= 20) {
                continue;
            }

            for (let [dx, dy] of neighbours) {
                let next = grid.get(node.x + dx, node.y + dy);
                if (!next) {
                    continue;
                }

                if (!next.wall && !counted.has(next) && next.steps > 0) {
                    counted.add(next);
                    let saved = next.steps - gridPosition.steps - steps - 1;
                    if (saved >= 100) {
                        part2++;
                    }
                }

                if (cheatSteps.has(next)) {
                    continue;
                }

                cheatSteps.set(next, steps + 1);
                queue.push(next);
            }
        }
    });

    return [part1, part2];
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
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
