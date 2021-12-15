const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');
const Queue = require('priorityqueuejs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581
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
    let part2 = undefined;
    const lines = input.split('\n').filter((line) => line.length);

    const map1 = new Grid();
    lines.forEach((line, y) => {
        line.split('').forEach((char, x) => {
            map1.set(x, y, { risk: +char, visited: false, x, y });
        });
    });

    part1 = find(map1);

    const width = map1.maxCol + 1;
    const height = map1.maxRow + 1;
    const map2 = new Grid();
    map1.forEach((node, x, y) => {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                const risk = ((node.risk + i + j - 1) % 9) + 1;
                const nx = width * i + x;
                const ny = height * j + y;
                map2.set(nx, ny, { risk, visited: false, x: nx, y: ny });
            }
        }
    });

    console.time('part2');
    part2 = find(map2);
    console.timeEnd('part2');

    return [part1, part2];
}

function find(map) {
    const q = new Queue((a, b) => b.total - a.total);

    q.enq(toNode(map.get(0, 0)));

    while (!q.isEmpty()) {
        const node = q.deq();
        const m = node.m;
        if (m.visited) {
            continue;
        }
        m.visited = true;

        const x = m.x;
        const y = m.y;
        const total = node.total;

        if (x === map.maxCol && y === map.maxRow) {
            return total;
        }

        for (const [dx, dy] of neighbours) {
            const next = map.get(x + dx, y + dy);
            if (next) {
                const nextNode = toNode(next);
                nextNode.total = total + nextNode.m.risk;
                q.enq(nextNode);
            }
        }
    }
}

function toNode(mapPosition) {
    const node = {
        total: 0,
        m: mapPosition
    };
    return node;
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
