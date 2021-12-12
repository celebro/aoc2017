const fs = require('fs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
start-A
start-b
A-c
A-b
b-d
A-end
b-end
`,
    `
dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc`,
    `fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW
`
].map((x) => x.trim());

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = 0;
    const lines = input.split('\n').filter((line) => line.length);

    /** @type {Record<string, Node>} */
    const nodes = {};

    lines.forEach((line) => {
        const [a, b] = line.split('-');
        const nodeA = nodes[a] || (nodes[a] = new Node(a));
        const nodeB = nodes[b] || (nodes[b] = new Node(b));
        nodeA.add(nodeB);
        nodeB.add(nodeA);
    });

    const visited = new Set();

    /**
     * @param {Node} node
     */
    function find1(node) {
        if (node.end) {
            part1++;
            return;
        }

        if (!node.big) {
            visited.add(node);
        }

        for (const edge of node.edges) {
            if (!visited.has(edge)) {
                find1(edge);
            }
        }

        visited.delete(node);
    }

    find1(nodes['start']);

    /**
     * @param {Node} node
     * @param {Node} twice
     */
    function find2(node, twice) {
        if (node.end) {
            part2++;
            return;
        }

        if (!node.big) {
            visited.add(node);
        }

        for (const edge of node.edges) {
            if (!visited.has(edge)) {
                find2(edge, twice);
            } else if (!edge.big && !twice && !edge.start) {
                find2(edge, edge);
            }
        }

        if (node !== twice) {
            visited.delete(node);
        }
    }

    find2(nodes['start'], null);

    return [part1, part2];
}

class Node {
    label = '';
    big = false;
    start = false;
    end = false;

    /** @type {Node[]} */
    edges = [];

    /**
     * @param {string} label
     */
    constructor(label) {
        this.label = label;
        if (label === label.toUpperCase()) {
            this.big = true;
        }
        if (label === 'start') {
            this.start = true;
        }
        if (label === 'end') {
            this.end = true;
        }
    }
    /**
     * @param {Node} node
     */
    add(node) {
        this.edges.push(node);
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
