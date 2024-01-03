const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

const right = { x: 1, y: 0 };
const left = { x: -1, y: 0 };
const up = { x: 0, y: -1 };
const down = { x: 0, y: 1 };

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = 0;
    const lines = input.split('\n').filter((line) => line.length);

    const map = new Grid();
    lines.forEach((line, y) => {
        line.split('').forEach((char, x) => {
            map.set(x, y, char);
        });
    });

    part1 = count(map, [
        {
            pos: {
                x: -1,
                y: 0
            },
            dir: right
        }
    ]);

    const starts = [
        Array.from({ length: map.maxCol + 1 }, (_, i) => ({ pos: { x: i, y: -1 }, dir: down })),
        Array.from({ length: map.maxCol + 1 }, (_, i) => ({ pos: { x: i, y: map.maxRow + 1 }, dir: up })),
        Array.from({ length: map.maxRow + 1 }, (_, i) => ({ pos: { x: -1, y: i }, dir: right })),
        Array.from({ length: map.maxRow + 1 }, (_, i) => ({ pos: { x: map.maxCol + 1, y: i }, dir: left }))
    ].flat();

    for (const start of starts) {
        const value = count(map, [start]);
        if (value > part2) {
            part2 = value;
        }
    }

    return [part1, part2];
}

/**
 *
 * @param {Grid<string>} map
 * @param {{ pos: { x: number, y: number}, dir: { x: number, y: number}}[]} beams
 * @returns
 */
function count(map, beams) {
    /** @type {Grid<Set<{ x: number, y: number }>>} */
    const energized = new Grid(() => new Set());

    while (beams.length) {
        const beam = beams.shift();

        while (true) {
            // energized.print();
            // console.log(beams.length);
            // debugger;
            let { pos, dir } = beam;

            pos.x += dir.x;
            pos.y += dir.y;

            const char = map.get(pos.x, pos.y);
            if (char === undefined) {
                // out of bounds
                break;
            }

            const visited = energized.get(pos.x, pos.y);
            if (visited.has(dir)) {
                break;
            }
            visited.add(dir);

            if (char === '/') {
                if (dir === right) {
                    dir = up;
                } else if (dir === left) {
                    dir = down;
                } else if (dir === up) {
                    dir = right;
                } else if (dir === down) {
                    dir = left;
                }
            } else if (char === '\\') {
                if (dir === right) {
                    dir = down;
                } else if (dir === left) {
                    dir = up;
                } else if (dir === up) {
                    dir = left;
                } else if (dir === down) {
                    dir = right;
                }
            } else if (char === '|') {
                if (dir === left || dir === right) {
                    beams.push({ pos: { ...pos }, dir: up });
                    beams.push({ pos: { ...pos }, dir: down });
                    break;
                }
            } else if (char === '-') {
                if (dir === up || dir === down) {
                    beams.push({ pos: { ...pos }, dir: left });
                    beams.push({ pos: { ...pos }, dir: right });
                    break;
                }
            }

            beam.dir = dir;
        }
    }

    let count = 0;
    energized.forEach((value) => {
        if (value.size) {
            count++;
        }
    });

    return count;
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
