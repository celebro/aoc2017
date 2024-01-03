const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');
const PriorityQueue = require('priorityqueuejs');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533
`,
    `
111111111111
999999999991
999999999991
999999999991
999999999991
`
].map((x) => x.trim());

const right = [1, 0];
const left = [-1, 0];
const down = [0, 1];
const up = [0, -1];
const neighbours = [right, left, up, down];

const reverse = new Map();
reverse.set(left, right);
reverse.set(right, left);
reverse.set(up, down);
reverse.set(down, up);

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter((line) => line.length);

    const map = new Grid();
    lines.forEach((line, y) => {
        line.split('').forEach((char, x) => {
            map.set(x, y, Number(char));
        });
    });

    part1 = solve1(map);
    part2 = solve2(map);
    // visited.print((x) => x, 5, ' ');

    return [part1, part2];
}

function solve1(map) {
    const queue = new PriorityQueue((a, b) => b.loss - a.loss);
    queue.enq({ x: 0, y: 0, loss: 0, last: undefined, dircount: 0 });

    const visited = new Set();

    while (!queue.isEmpty()) {
        const node = queue.deq();

        const { x, y, loss, last, dircount } = node;
        const key = [x, y, ...(last || []), dircount].join('#');
        if (visited.has(key)) {
            continue;
        }
        visited.add(key);

        if (x === map.maxCol && y === map.maxRow) {
            return loss;
        }

        for (const neigh of neighbours) {
            if (neigh === reverse.get(last)) {
                continue;
            }

            let nextdircount = 1;
            if (neigh === last) {
                nextdircount = dircount + 1;
                if (nextdircount === 4) {
                    continue;
                }
            }

            const [dx, dy] = neigh;
            const cost = map.get(x + dx, y + dy);
            if (cost) {
                queue.enq({ x: x + dx, y: y + dy, loss: loss + cost, last: neigh, dircount: nextdircount });
            }
        }
    }
}

function solve2(map) {
    const queue = new PriorityQueue((a, b) => b.loss - a.loss);
    queue.enq({ x: 0, y: 0, loss: 0, last: undefined, dircount: 0 });
    const visited = new Set();

    while (!queue.isEmpty()) {
        const node = queue.deq();

        const { x, y, loss, last, dircount } = node;
        if (x === map.maxCol && y === map.maxRow && dircount >= 4) {
            return loss;
        }

        const key = [x, y, ...(last || []), dircount].join('#');
        if (visited.has(key)) {
            continue;
        }
        visited.add(key);

        let availableNeighbours = neighbours;
        if (last && dircount < 4) {
            availableNeighbours = [last];
        }

        for (const neigh of availableNeighbours) {
            if (neigh === reverse.get(last)) {
                continue;
            }

            let nextdircount = 1;
            if (neigh === last) {
                nextdircount = dircount + 1;
                if (nextdircount === 11) {
                    continue;
                }
            }

            const [dx, dy] = neigh;
            const cost = map.get(x + dx, y + dy);
            if (cost) {
                queue.enq({ x: x + dx, y: y + dy, loss: loss + cost, last: neigh, dircount: nextdircount });
            }
        }
    }
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
