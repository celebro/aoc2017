const fs = require('fs');
const Grid = require('../utils/Grid');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..###..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#..#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#......#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#.....####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.......##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#

#..#.
#....
##..#
..#..
..###
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

function toBit(char) {
    return char === '#' ? 1 : 0;
}

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = 0;
    const lines = input.split('\n').filter((line) => line.length);

    const lookup = lines.shift().split('').map(toBit);
    let map = new Grid();

    lines.forEach((line, y) => {
        line.split('').forEach((char, x) => {
            map.set(x, y, toBit(char));
        });
    });

    map.print((x) => x);

    for (let i = 0; i < 50; i++) {
        const next = new Grid();
        for (let y = map.minRow - 1; y <= map.maxRow + 1; y++) {
            for (let x = map.minCol - 1; x <= map.maxCol + 1; x++) {
                let index = 0;

                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        index = index << 1;
                        let value = map.get(x + dx, y + dy);
                        if (value === undefined && lookup[0] === 1 && i % 2 === 1) {
                            value = 1;
                        }
                        if (value) {
                            index++;
                        }
                    }
                }

                next.set(x, y, lookup[index]);
            }
        }
        map = next;

        if (i === 1) {
            map.forEach((value) => {
                if (value) {
                    part1++;
                }
            });
        }
        if (i === 49) {
            map.forEach((value) => {
                if (value) {
                    part2++;
                }
            });
        }
    }

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
