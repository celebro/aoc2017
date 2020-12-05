const fs = require('fs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
..##.......
#...#...#..
.#....#..#.
..#.#...#.#
.#...##..#.
..#.##.....
.#.#.#....#
.#........#
#.##...#...
#...##....#
.#..#...#.#
`
].map((x) => x.trim());

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = 1;
    const lines = input.split('\n').filter((line) => line.length);

    console.time('f');

    const slopes = [
        [1, 1],
        [3, 1],
        [5, 1],
        [7, 1],
        [1, 2]
    ];

    for (const slope of slopes) {
        const dx = slope[0];
        const dy = slope[1];
        const width = lines[0].length;

        let x = 0;
        let y = 0;
        let trees = 0;

        while (y < lines.length) {
            if (lines[y].charAt(x) === '#') {
                trees += 1;
            }
            y = y + dy;
            x = (x + dx) % width;
        }

        if (dx === 3) {
            part1 = trees;
        }
        part2 = part2 * trees;
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
