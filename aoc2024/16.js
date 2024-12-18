const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');
const Queue = require('priorityqueuejs');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############
`
].map((x) => x.trim());

const dirs = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1]
];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = 0;
    let lines = readInput(input);

    let map = new Grid();
    let start;
    let end;

    for (let y = 0; y < lines.length; y++) {
        let line = lines[y];
        for (let x = 0; x < line.length; x++) {
            let node = {
                x,
                y,
                char: line[x],
                cost: Infinity,
                done: false,
                dir: undefined,

                byDir: [
                    { cost: Infinity, from: null },
                    { cost: Infinity, from: null },
                    { cost: Infinity, from: null },
                    { cost: Infinity, from: null }
                ]
            };
            map.set(x, y, node);
            if (line[x] === 'S') {
                start = node;
            }
            if (line[x] === 'E') {
                end = node;
            }
        }
    }

    let q = new Queue((a, b) => b.cost - a.cost);
    start.cost = 0;
    start.dir = dirs[0];
    q.enq(start);

    while (!q.isEmpty()) {
        let node = q.deq();
        if (node.done) {
            continue;
        }
        node.done = true;

        if (node.char === 'E') {
            part1 = node.cost;
            break;
        }

        for (let dir of dirs) {
            let next = map.get(node.x + dir[0], node.y + dir[1]);
            if (next.done || next.char === '#') {
                continue;
            }

            if (dir[0] === -node.dir[0] && dir[1] === -node.dir[1]) {
                // 180, ignore
                continue;
            }

            let cost = dir === node.dir ? 1 : 1001;
            if (node.cost + cost < next.cost) {
                next.cost = node.cost + cost;
                next.dir = dir;
                q.enq(next);
            }
        }
    }

    q = new Queue((a, b) => b.cost - a.cost);
    q.enq({ pos: start, dirIx: 0, cost: 0 });

    while (!q.isEmpty()) {
        let { pos, dirIx, cost } = q.deq();
        if (cost >= part1) {
            break;
        }

        for (let i of [-1, 0, 1]) {
            let nextDirIx = (dirIx + i + 4) % 4;
            let nextDir = dirs[nextDirIx];

            let nextPos;
            let nextCost;

            if (i === 0) {
                nextPos = map.get(pos.x + nextDir[0], pos.y + nextDir[1]);
                if (nextPos.char === '#') {
                    continue;
                }
                nextCost = cost + 1;
            } else {
                nextPos = pos;
                nextCost = cost + 1000;
            }

            if (nextCost < nextPos.byDir[nextDirIx].cost) {
                nextPos.byDir[nextDirIx].from = [];
                q.enq({ pos: nextPos, dirIx: nextDirIx, cost: nextCost });
            }
            if (nextCost <= nextPos.byDir[nextDirIx].cost) {
                nextPos.byDir[nextDirIx].cost = nextCost;
                nextPos.byDir[nextDirIx].from.push({ pos, dirIx });
            }
        }
    }

    let todo = [];
    for (let byDir of end.byDir) {
        if (byDir.from?.length) {
            todo.push({ pos: end, dirIx: end.byDir.indexOf(byDir) });
        }
    }

    while (todo.length) {
        let { pos, dirIx } = todo.pop();

        if (!pos.paint) {
            pos.paint = true;
            part2++;
        }

        if (pos.byDir[dirIx].from?.length) {
            todo.push(...pos.byDir[dirIx].from);
            pos.byDir[dirIx].from = [];
        }
    }

    map.print((node) => {
        if (node.paint) {
            return 'O';
        }
        return node.char;
    });

    return [part1, part2];
}

/**
 * @param {string} input
 */
function readInput(input) {
    let lines = input.split('\n');
    let startIx = 0;
    let endIx = lines.length;
    while (lines[startIx] === '\n' || lines[startIx] === '') {
        startIx++;
    }
    while (lines[endIx - 1] === '\n' || lines[endIx - 1] === '') {
        endIx--;
    }
    return lines.slice(startIx, endIx);
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
