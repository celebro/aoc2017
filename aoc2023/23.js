const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
#.#####################
#.......#########...###
#######.#########.#.###
###.....#.>.>.###.#.###
###v#####.#v#.###.#.###
###.>...#.#.#.....#...#
###v###.#.#.#########.#
###...#.#.#.......#...#
#####.#.#.#######.#.###
#.....#.#.#.......#...#
#.#####.#.#.#########v#
#.#...#...#...###...>.#
#.#.#v#######v###.###v#
#...#.>.#...>.>.#.###.#
#####v#.#.###v#.#.###.#
#.....#...#...#.#.#...#
#.#########.###.#.#.###
#...###...#...#...#.###
###.###.#.###v#####v###
#...#...#.#.>.>.#.>.###
#.###.###.#.###.#.#v###
#.....###...###...#...#
#####################.#
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

    const map = new Grid();
    lines.forEach((line, y) => {
        line.split('').forEach((char, x) => {
            const node = { x, y, char, max: 0, inputs: [], outputs: [], edges: [], p1: 0 };
            map.set(x, y, node);
        });
    });

    const start = map.get(1, 0);
    const end = map.get(map.maxCol - 1, map.maxRow);

    const nodes = new Set();
    nodes.add(start);
    nodes.add(end);

    map.forEach((node) => {
        if (node.char === '.') {
            const up = map.get(node.x, node.y - 1);
            const left = map.get(node.x - 1, node.y);
            const down = map.get(node.x, node.y + 1);
            const right = map.get(node.x + 1, node.y);

            const inputs = [];
            if (up && up.char === 'v') {
                inputs.push(up);
            }
            if (left && left.char === '>') {
                inputs.push(up);
            }

            const outputs = [];
            if (down && down.char === 'v') {
                outputs.push(down);
            }
            if (right && right.char === '>') {
                outputs.push(right);
            }

            if (inputs.length && outputs.length) {
                node.inputs = inputs;
                node.outputs = outputs;
                nodes.add(node);
            }
        }
    });

    start.edges.push(walkToNode(start));
    for (const node of nodes) {
        for (const output of node.outputs) {
            const edge = walkToNode(output, node);
            edge.dist++;
            node.edges.push(edge);
        }
    }

    function walkToNode(start, last) {
        let dist = 0;
        let current = start;
        while (current) {
            for (const [dx, dy] of neighbours) {
                const next = map.get(current.x + dx, current.y + dy);
                if (next && next.char !== '#' && next !== last) {
                    last = current;
                    current = next;
                    break;
                }
            }
            dist++;
            if (nodes.has(current)) {
                return { node: current, dist };
            }
        }
    }

    const queue = [start];
    while (queue.length > 0) {
        const node = queue.pop();
        for (const edge of node.edges) {
            edge.node.max = Math.max(edge.node.max, node.max + edge.dist);
            if (edge.node.inputs.length === ++edge.node.p1) {
                queue.push(edge.node);
            }
        }
    }

    part1 = end.max;

    //////////

    const edgesToReverse = [];
    for (const node of nodes) {
        for (const edge of node.edges) {
            edgesToReverse.push({ node, edge });
        }
    }
    for (const { node, edge } of edgesToReverse) {
        edge.node.edges.push({ node, dist: edge.dist });
    }
    const lastEdge = end.edges[0];
    lastEdge.node.edges = [{ node: end, dist: lastEdge.dist }];

    const visited = new Set([start]);
    part2 = 0;
    function go(node, dist) {
        if (node === end) {
            part2 = Math.max(part2, dist);
            return;
        }
        for (const edge of node.edges) {
            if (!visited.has(edge.node)) {
                visited.add(edge.node);
                go(edge.node, dist + edge.dist);
                visited.delete(edge.node);
            }
        }
    }

    go(start, 0);

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
