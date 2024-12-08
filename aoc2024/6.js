const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...
`
].map((x) => x.trim());

const dirs = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0]
];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = 0;
    let lines = readInput(input);

    let grid = new Grid();
    let posx = 0;
    let posy = 0;

    for (let y = 0; y < lines.length; y++) {
        let line = lines[y];
        for (let x = 0; x < line.length; x++) {
            if (line[x] === '^') {
                posx = x;
                posy = y;
            }
            grid.set(x, y, {
                full: line[x] === '#'
            });
        }
    }

    part1 = walk(grid, posx, posy);

    grid.forEach((cell) => {
        if (!cell.full) {
            cell.full = true;
            if (walk(grid, posx, posy) === Infinity) {
                part2++;
            }
            cell.full = false;
        }
    });

    return [part1, part2];
}

/**
 * @param {Grid} grid
 * @param {number} posx
 * @param {number} posy
 */
function walk(grid, posx, posy) {
    let dirIx = 0;
    let visited = new Map();
    visited.set(grid.get(posx, posy), [1, 0, 0, 0]);

    while (true) {
        let nextX = posx + dirs[dirIx][0];
        let nextY = posy + dirs[dirIx][1];

        let next = grid.get(nextX, nextY);
        if (next === undefined) {
            break;
        }
        if (next.full) {
            dirIx = (dirIx + 1) % 4;
        } else {
            posx = nextX;
            posy = nextY;

            let history = visited.get(next);
            if (!history) {
                history = [0, 0, 0, 0];
                visited.set(next, history);
            }
            if (history[dirIx]) {
                return Infinity;
            }
            history[dirIx] = 1;
        }
    }

    return visited.size;
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
