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
2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5
`
].map((x) => x.trim());

const neighbours = [
    [1, 0, 0],
    [-1, 0, 0],
    [0, 1, 0],
    [0, -1, 0],
    [0, 0, 1],
    [0, 0, -1]
];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = 0;
    const lines = input.split('\n').filter((line) => line.length);

    const space = {};

    function k(x, y, z) {
        return [x, y, z].join('=');
    }

    let max = 0;
    let min = Infinity;
    lines.forEach((line, ix) => {
        const [x, y, z] = sscanf(line, '%d,%d,%d');
        space[k(x, y, z)] = { x, y, z };
        max = Math.max(max, x, y, z);
        min = Math.min(min, x, y, z);
    });

    for (const { x, y, z } of Object.values(space)) {
        for (const n of neighbours) {
            if (!space[k(x + n[0], y + n[1], z + n[2])]) {
                part1++;
            }
        }
    }

    max = max + 1;
    min = min - 1;

    const list = new List();
    list.enq({ x: min, y: min, z: min });
    const visited = {};

    while (!list.isEmpty()) {
        const p = list.deq();
        const key = k(p.x, p.y, p.z);

        if (visited[key] || p.x < min || p.x > max || p.y < min || p.y > max || p.z < min || p.z > max) {
            continue;
        }
        visited[key] = true;

        for (const n of neighbours) {
            if (space[k(p.x + n[0], p.y + n[1], p.z + n[2])]) {
                part2++;
            } else {
                list.enq({ x: p.x + n[0], y: p.y + n[1], z: p.z + n[2] });
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
