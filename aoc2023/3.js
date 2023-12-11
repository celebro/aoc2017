const fs = require('fs');
const Grid = require('../utils/Grid');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
`
].map((x) => x.trim());

const neighbours = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1]
];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = 0;
    const lines = input.split('\n').filter((line) => line.length);

    const grid = new Grid();
    const gears = new Grid(() => new Set());

    lines.forEach((line, row) => {
        line.split('').forEach((char, col) => {
            grid.set(col, row, char);
        });
    });

    lines.forEach((line, row) => {
        let num = {
            value: 0
        };
        let valid = false;

        line.split('').forEach((char, col) => {
            const charNum = parseInt(char);

            if (!Number.isNaN(charNum)) {
                num.value = num.value * 10 + charNum;
                for (const [x, y] of neighbours) {
                    const symbol = grid.get(col + x, row + y);
                    if (symbol === undefined || symbol === '.' || !isNaN(symbol)) {
                        //
                    } else {
                        valid = true;
                    }

                    if (symbol === '*') {
                        gears.get(col + x, row + y).add(num);
                    }
                }
            }

            if (Number.isNaN(charNum) || col === line.length - 1) {
                if (num) {
                    if (valid) {
                        part1 += num.value;
                    }
                }
                num = {
                    value: 0
                };
                valid = false;
            }
        });
    });

    gears.forEach((gear) => {
        if (gear.size !== 1) {
        }
        if (gear.size === 2) {
            const values = gear.values();
            part2 += values.next().value.value * values.next().value.value;
        }
    });

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

// 542316 too low
