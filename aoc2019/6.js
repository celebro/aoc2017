const fs = require('fs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}

const testInput = `
COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L
K)YOU
I)SAN
`.trim();

class Node {
    /**
     * @param {string} id
     */
    constructor(id) {
        this.id = id;
        /** @type Node */
        this.parent = null;
        /** @type Node[] */
        this.children = [];
        this.steps = 0;
    }
}

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter(line => line.length);

    console.time('part1');

    /** @type Map<string, Node> */
    const map = new Map();
    const root = new Node('COM');
    map.set(root.id, root);

    function getNode(id) {
        let node = map.get(id);
        if (!node) {
            node = new Node(id);
            map.set(id, node);
        }
        return node;
    }

    lines.forEach(line => {
        const [center, object] = line.split(')');

        const centerNode = getNode(center);
        const objectNode = getNode(object);
        objectNode.parent = centerNode;
        centerNode.children.push(objectNode);
    });

    /**
     * @param {Node} node
     * @param {number} level
     */
    function countOrbits(node, level) {
        let sum = level;
        for (const child of node.children) {
            sum = sum + countOrbits(child, level + 1);
        }
        return sum;
    }

    part1 = countOrbits(root, 0);
    console.timeEnd('part1');

    /* PART 2 */
    console.time('part2');
    const start = map.get('YOU').parent;
    const target = map.get('SAN').parent;

    let node = start;
    let steps = 0;
    while (node) {
        node.steps = steps;
        node = node.parent;
        steps = steps + 1;
    }

    node = target;
    steps = 0;
    while (node) {
        if (node.steps !== 0) {
            part2 = node.steps + steps;
            break;
        }
        node = node.parent;
        steps = steps + 1;
    }
    console.timeEnd('part2');

    return [part1, part2];
}

const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));
