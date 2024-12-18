const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
0123
1234
8765
9876
`,
    `
89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732
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
    let part1 = 0;
    let part2 = 0;
    let lines = readInput(input);

    let heads = [];
    let grid = new Grid();
    for (let y = 0; y < lines.length; y++) {
        let line = lines[y];
        for (let x = 0; x < line.length; x++) {
            let char = line[x];
            // @ts-ignore
            let node = { x, y, value: isNaN(char) ? undefined : +char };
            grid.set(x, y, node);

            if (char === '0') {
                heads.push(node);
            }
        }
    }

    for (let head of heads) {
        let nodes = [head];
        let count = new WeakMap();
        count.set(head, 1);

        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            let nodeCount = count.get(node);
            if (node.value === 9) {
                part1++;
                part2 += nodeCount;
                continue;
            }
            for (let [dx, dy] of neighbours) {
                let next = grid.get(node.x + dx, node.y + dy);
                if (next && next.value === node.value + 1) {
                    let nextCount = count.get(next);
                    if (nextCount) {
                        count.set(next, nextCount + nodeCount);
                    } else {
                        count.set(next, nodeCount);
                        nodes.push(next);
                    }
                }
            }
        }
    }

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
