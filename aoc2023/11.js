const fs = require('fs');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....
`
].map((x) => x.trim());

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = 0;
    const lines = input.split('\n').filter((line) => line.length);

    const galaxies = [];
    const hasAnyX = {};
    const hasAnyY = {};
    lines.forEach((line, iy) => {
        line.split('').forEach((char, ix) => {
            if (char === '#') {
                galaxies.push({ x: ix, y: iy });
                hasAnyX[ix] = true;
                hasAnyY[iy] = true;
            }
        });
    });

    for (let i = 0; i < galaxies.length; i++) {
        for (let j = i; j < galaxies.length; j++) {
            const a = galaxies[i];
            const b = galaxies[j];

            let distance = 0;
            let distance2 = 0;
            for (let x = Math.min(a.x, b.x) + 1; x <= Math.max(a.x, b.x); x++) {
                distance++;
                distance2++;
                if (!hasAnyX[x]) {
                    distance++;
                    distance2 += 1000000 - 1;
                }
            }
            for (let y = Math.min(a.y, b.y) + 1; y <= Math.max(a.y, b.y); y++) {
                distance++;
                distance2++;
                if (!hasAnyY[y]) {
                    distance++;
                    distance2 += 1000000 - 1;
                }
            }

            part1 += distance;
            part2 += distance2;
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
