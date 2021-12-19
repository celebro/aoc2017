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
[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]
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

    const snailfish = [];

    lines.forEach((line) => {
        const stack = [];
        for (const char of line) {
            // @ts-ignore
            if (!isNaN(char)) {
                const node = createNode();
                node.value = +char;
                stack.push(node);
            } else if (char === ']') {
                const node = createNode();
                node.right = stack.pop();
                node.left = stack.pop();
                stack.push(node);
            }
        }
        snailfish.push(stack[0]);
    });

    let sum;
    for (const num of snailfish) {
        if (!sum) {
            sum = num;
        } else {
            sum = add(sum, num);
        }
    }
    part1 = magnitude(sum);

    //
    part2 = 0;
    for (let i = 0; i < snailfish.length; i++) {
        for (let j = 0; j < snailfish.length; j++) {
            if (i === j) {
                continue;
            }

            const mag = magnitude(add(snailfish[i], snailfish[j]));
            if (mag > part2) {
                part2 = mag;
            }
        }
    }

    return [part1, part2];
}

function add(a, b) {
    const node = createNode();
    node.left = structuredClone(a);
    node.right = structuredClone(b);
    return reduce(node);
}

function magnitude(node) {
    if (node.value !== null) {
        return node.value;
    } else {
        return 3 * magnitude(node.left) + 2 * magnitude(node.right);
    }
}

function reduce(root) {
    root.level = 0;

    let change = true;
    while (change) {
        change = explode(root) || split(root);
    }

    return root;
}

function explode(root) {
    let change = false;

    const stack = [root];
    let lastValue = null;
    let toExplode = null;

    while (stack.length) {
        const node = stack.pop();

        if (node.level === 4 && node.value === null && !toExplode) {
            change = true;
            if (lastValue) {
                lastValue.value += node.left.value;
            }
            toExplode = node.right;
            node.value = 0;
            node.left = null;
            node.right = null;
            continue;
        }

        if (node.value === null) {
            node.right.level = node.left.level = node.level + 1;
            stack.push(node.right);
            stack.push(node.left);
        } else {
            lastValue = node;
            if (toExplode) {
                node.value += toExplode.value;
                break;
            }
        }
    }

    return change;
}

function split(root) {
    let change = false;

    const stack = [root];
    while (stack.length) {
        const node = stack.pop();
        if (node.value === null) {
            node.right.level = node.left.level = node.level + 1;
            stack.push(node.right);
            stack.push(node.left);
        } else if (node.value >= 10) {
            change = true;

            node.left = createNode();
            node.right = createNode();

            node.left.value = Math.floor(node.value / 2);
            node.right.value = Math.ceil(node.value / 2);
            node.value = null;

            break;
        }
    }

    return change;
}

function createNode() {
    return {
        left: null,
        right: null,
        value: null,
        level: 0
    };
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
