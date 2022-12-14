const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = 0;
    const lines = input.split('\n').filter((line) => line.length);

    const grid = new Grid();

    lines.forEach((line, ix) => {
        const coords = line.split(' -> ').map((part) => part.split(',').map((x) => +x));

        for (let i = 1; i < coords.length; i++) {
            const a = coords[i - 1];
            const b = coords[i];

            const [x0, x1] = sort(a[0], b[0]);
            const [y0, y1] = sort(a[1], b[1]);

            for (let x = x0; x <= x1; x++) {
                for (let y = y0; y <= y1; y++) {
                    grid.set(x, y, '#');
                }
            }
        }
    });

    const floor = grid.maxRow + 2;

    while (drop()) {}

    function drop() {
        let x = 500;
        let y = 0;

        if (grid.get(x, y)) {
            return false;
        }

        while (true) {
            if (y === floor - 1) {
                grid.set(x, y, 'o');
                part2++;
                return true;
            } else if (!grid.get(x, y + 1)) {
                y++;
            } else if (!grid.get(x - 1, y + 1)) {
                x--;
                y++;
            } else if (!grid.get(x + 1, y + 1)) {
                x++;
                y++;
            } else {
                grid.set(x, y, 'o');
                if (part1 === part2) {
                    part1++;
                }
                part2++;
                return true;
            }
        }
    }

    grid.print((v) => {
        if (v === 'o') {
            return '░';
        } else if (v === '#') {
            return '█';
        } else {
            return '.';
        }
    });

    return [part1, part2];
}

function sort(a, b) {
    if (a <= b) {
        return [a, b];
    }
    return [b, a];
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
