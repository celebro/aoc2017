const fs = require('fs');
const Grid = require('../utils/Grid');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526
`
].map((x) => x.trim());

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = undefined;
    const lines = input.split('\n').filter((line) => line.length);
    const map = new Grid();

    lines.forEach((line, y) => {
        line.split('').forEach((char, x) => {
            map.set(x, y, +char);
        });
    });

    let i = 1;
    while (true) {
        const flashes = [];
        map.forEach((value, x, y) => {
            const newValue = value + 1;
            map.set(x, y, newValue);
            if (newValue === 10) {
                flashes.push({ x, y });
            }
        });

        let flashCount = 0;
        while (flashes.length) {
            const { x, y } = flashes.pop();
            flashCount++;
            map.forSlice(x - 1, y - 1, 3, 3, (value, xx, yy) => {
                if (x === xx && y === yy) {
                    return;
                }

                const newValue = value + 1;
                map.set(xx, yy, newValue);
                if (newValue === 10) {
                    flashes.push({ x: xx, y: yy });
                }
            });
        }

        map.forEach((value, x, y) => {
            if (value > 9) {
                map.set(x, y, 0);
            }
        });

        if (i <= 100) {
            part1 += flashCount;
        } else if (flashCount === 100) {
            part2 = i;
            break;
        }

        i++;
    }

    // map.print((x) => x);

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
