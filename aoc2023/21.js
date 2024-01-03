const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........
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
    let part1 = undefined;
    let part2 = 0;
    const lines = input.split('\n').filter((line) => line.length);

    const map = new Grid();
    /** @type {{ x: number, y: number, char: string }} */
    let start;

    lines.forEach((line, y) => {
        line.split('').forEach((char, x) => {
            const node = { x, y, char };
            if (char === 'S') {
                start = node;
                node.char = '.';
            }
            map.set(x, y, node);
        });
    });

    if (!start) {
        throw new Error();
    }

    part1 = count(map, start, 64).even;

    // https://github.com/villuna/aoc23/wiki/A-Geometric-solution-to-advent-of-code-2023,-day-21
    const count130 = count(map, start, 130);
    const count65 = count(map, start, 65);
    const n = (26501365 - 65) / 131;
    // base diamond
    part2 = (n + 1) * (n + 1) * count130.odd + n * n * count130.even;
    // add missing orange triangles
    part2 += n * (count130.even - count65.even);
    // remove purple triangles
    part2 -= (n + 1) * (count130.odd - count65.odd);

    return [part1, part2];
}

function count(map, start, steps) {
    /** @type {Set<{x: number, y: number, char: string }>} */
    let old = new Set([start]);
    let visited = new Set();

    let odd = 0;
    let even = 0;

    for (let i = 1; i <= steps; i++) {
        const next = new Set();
        for (const node of old) {
            for (const [dx, dy] of neighbours) {
                const nextNode = map.get(node.x + dx, node.y + dy);
                if (nextNode && nextNode.char === '.') {
                    next.add(nextNode);

                    if (!visited.has(nextNode)) {
                        if (i % 2 === 0) {
                            even++;
                        } else {
                            odd++;
                        }
                        visited.add(nextNode);
                    }
                }
            }
        }
        old = next;
    }

    return { odd, even };
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
// 625585513950284 too low
// 625585535798684 too low
// 625586305550152 too low
// 625586339536416 not correct
// 625587097150084
