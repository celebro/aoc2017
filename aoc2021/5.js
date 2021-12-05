const fs = require('fs');
const sscanf = require('scan.js').scan;
// @ts-ignore
const Grid = require('../utils/Grid');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2
`
].map((x) => x.trim());

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = 0;
    const lines = input.split('\n').filter((line) => line.length);

    const map = new Grid(() => ({ n1: 0, n2: 0 }));

    lines.forEach((line) => {
        const [x1, y1, x2, y2] = sscanf(line, '%d,%d -> %d,%d');
        const horizontalOrVertical = x1 === x2 || y1 === y2;

        const dx = getDelta(x1, x2);
        const dy = getDelta(y1, y2);
        let x = x1;
        let y = y1;

        if (horizontalOrVertical) {
            map.get(x, y).n1++;
        }
        map.get(x, y).n2++;
        while (x !== x2 || y !== y2) {
            x = x + dx;
            y = y + dy;
            if (horizontalOrVertical) {
                map.get(x, y).n1++;
            }
            map.get(x, y).n2++;
        }
    });

    map.forEach(({ n1, n2 }) => {
        if (n1 > 1) {
            part1++;
        }
        if (n2 > 1) {
            part2++;
        }
    });

    return [part1, part2];
}

function getDelta(a, b) {
    if (a === b) {
        return 0;
    }
    return a > b ? -1 : 1;
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
