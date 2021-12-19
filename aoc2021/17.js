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
target area: x=20..30, y=-10..-5
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = 0;
    const lines = input.split('\n').filter((line) => line.length);

    const [x1, x2, y1, y2] = sscanf(lines[0], 'target area: x=%d..%d, y=%d..%d');

    const vy1 = -y1 - 1;
    const maxHeigh = (vy1 * (vy1 + 1)) / 2;
    part1 = maxHeigh;

    for (let vy = y1; vy <= vy1; vy++) {
        for (let vx = 0; vx <= x2; vx++) {
            let x = 0;
            let y = 0;
            let dy = vy;
            let dx = vx;

            while (true) {
                x = x + dx;
                y = y + dy;
                if (dx > 0) {
                    dx--;
                }
                dy--;

                if (x > x2 || y < y1) {
                    break;
                }

                if (x >= x1 && y <= y2) {
                    part2++;
                    break;
                }
            }
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
