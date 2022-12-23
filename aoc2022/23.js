const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    //     `.....
    // ..##.
    // ..#..
    // .....
    // ..##.
    // .....
    // `,

    `..............
..............
.......#......
.....###.#....
...#...#.#....
....#...##....
...#.###......
...##.#.##....
....#..#......
..............
..............
..............
`
].map((x) => x.trim());

const neighbours = [
    {
        delta: [0, -1],
        check: [
            [0, -1],
            [-1, -1],
            [1, -1]
        ]
    },
    {
        delta: [0, 1],
        check: [
            [0, 1],
            [-1, 1],
            [1, 1]
        ]
    },
    {
        delta: [-1, 0],
        check: [
            [-1, 0],
            [-1, -1],
            [-1, 1]
        ]
    },
    {
        delta: [1, 0],
        check: [
            [1, 0],
            [1, -1],
            [1, 1]
        ]
    }
];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter((line) => line.length);

    let grid = new Grid();
    const elves = [];
    lines.forEach((line, iy) => {
        line.split('').forEach((char, ix) => {
            if (char === '#') {
                elves.push({
                    x: ix,
                    y: iy,
                    nx: undefined,
                    ny: undefined
                });
                grid.set(ix, iy, '#');
            }
        });
    });

    // grid.print((x) => x, 1, '.');

    function k(elf) {
        return `${elf.nx}=${elf.ny}`;
    }

    let dirIx = 0;
    let i = 0;
    while (true) {
        i++;
        const counts = {};

        for (const elf of elves) {
            let hasNeighbours = false;
            for (let a = -1; a <= 1; a++) {
                for (let b = -1; b <= 1; b++) {
                    if (a !== 0 || b !== 0) {
                        hasNeighbours = hasNeighbours || !!grid.get(elf.x + a, elf.y + b);
                    }
                }
            }
            if (!hasNeighbours) {
                continue;
            }

            for (let j = 0; j < 4; j++) {
                const dir = neighbours[(dirIx + j) % 4];
                const canMove = dir.check.every(([dx, dy]) => !grid.get(elf.x + dx, elf.y + dy));
                if (canMove) {
                    elf.nx = elf.x + dir.delta[0];
                    elf.ny = elf.y + dir.delta[1];
                    counts[k(elf)] = (counts[k(elf)] || 0) + 1;
                    break;
                }
            }
        }

        grid = new Grid();
        let moved = 0;
        for (const elf of elves) {
            if (elf.x !== undefined && counts[k(elf)] === 1) {
                elf.x = elf.nx;
                elf.y = elf.ny;
                moved++;
            }
            elf.nx = undefined;
            elf.ny = undefined;
            grid.set(elf.x, elf.y, '#');
        }

        if (i === 10) {
            part1 = (grid.maxCol - grid.minCol + 1) * (grid.maxRow - grid.minRow + 1) - elves.length;
        }
        if (moved === 0) {
            part2 = i;
            break;
        }

        dirIx = (dirIx + 1) % 4;
    }

    // grid.print((x) => x || '.', 1, '.');

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
