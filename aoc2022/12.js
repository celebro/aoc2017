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
Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi
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
    let part2 = Infinity;
    const lines = input.split('\n').filter((line) => line.length);

    const grid = new Grid();
    let start, end;

    lines.forEach((line, iy) => {
        line.split('').forEach((char, ix) => {
            const loc = {
                x: ix,
                y: iy,
                elev: 0,
                visited: false,
                steps: 0
            };

            let value = char;
            if (char === 'S') {
                char = 'a';
                start = loc;
            } else if (char === 'E') {
                char = 'z';
                end = loc;
            }

            loc.elev = char.charCodeAt(0);
            grid.set(ix, iy, loc);
        });
    });

    const list = new List();
    end.visited = true;
    list.enq(end);

    while (list._size > 0) {
        const curr = list.deq();

        if (curr === start) {
            part1 = curr.steps;
        } else if (curr.elev === 'a'.charCodeAt(0)) {
            part2 = Math.min(part2, curr.steps);
        }

        for (const n of neighbours) {
            const next = grid.get(curr.x + n[0], curr.y + n[1]);
            if (next && !next.visited && curr.elev - next.elev <= 1) {
                next.steps = curr.steps + 1;
                next.visited = true;
                list.enq(next);
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
