const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
jqt: rhn xhk nvd
rsh: frs pzl lsr
xhk: hfx
cmg: qnr nvd lhk bvb
rhn: xhk bvb hfx
bvb: xhk hfx
pzl: lsr hfx nvd
qnr: nvd
ntq: jqt hfx bvb xhk
nvd: lhk
lsr: lhk
rzs: qnr cmg lsr rsh
frs: qnr lhk lsr
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter((line) => line.length);

    const edges = new Map();
    const nodes = new Set();
    const edgeData = [];

    function addEdge(a, b) {
        edges.set(a, edges.get(a) || []);
        edges.set(b, edges.get(b) || []);

        const data = { block: false, count: 0, a, b };
        edgeData.push(data);
        edges.get(a).push({ node: b, data });
        edges.get(b).push({ node: a, data });
    }

    lines.forEach((line) => {
        const [a, rest] = line.split(': ');
        nodes.add(a);
        for (const b of rest.split(' ')) {
            nodes.add(b);
            addEdge(a, b);
        }
    });

    function visit(node) {
        const visited = new Set();
        visited.add(node);
        const queue = [{ node, steps: 0 }];

        let max = 0;
        while (queue.length) {
            const { node: current, steps } = queue.shift();
            max = Math.max(steps, max);
            for (const edge of edges.get(current)) {
                if (!visited.has(edge.node) && !edge.data.block) {
                    visited.add(edge.node);
                    queue.push({ node: edge.node, steps: steps + 1 });
                    edge.data.count++;
                }
            }
        }

        return { max, count: visited.size };
    }

    for (const node of nodes) {
        visit(node);
    }

    edgeData.sort((a, b) => b.count - a.count);
    for (let i = 0; i < 3; i++) {
        edgeData[i].block = true;
    }
    console.log(edgeData.slice(0, 10));

    const c1 = visit(nodes.values().next().value).count;
    const c2 = nodes.size - c1;
    part1 = c1 * c2;

    // let values = [];
    // for (const node of nodes) {
    //     values.push({ node, steps: visit(node).max });
    // }
    // values.sort((a, b) => a.steps - b.steps);
    // const min = values[0].steps;

    // values = values.filter((a) => a.steps <= min + 1);
    // const fromValues = values.filter((a) => a.steps === min);
    // const toValues = fromValues.length >= 6 ? fromValues : values.filter((a) => a.steps === min + 1);

    // for (let count = 0; count < 3; count++) {
    //     const { node, steps } = fromValues.shift();
    //     for (const edge of edges.get(node)) {
    //         const other = toValues.find((a) => a.node === edge.node);
    //         if (other) {
    //             const index = toValues.indexOf(other);
    //             toValues.splice(index, 1);
    //             edge.data.block = true;
    //             break;
    //         }
    //     }
    // }

    // const c1 = visit(nodes.values().next().value).count;
    // const c2 = nodes.size - c1;
    // part1 = c1 * c2;

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
