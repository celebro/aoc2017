const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');
const lcm = require('lcm');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)
`,
    `
LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)
`,
    `
    LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = 1;
    const lines = input.split('\n').filter((line) => line.length);

    const directions = lines.shift().split('');
    const map = {};
    lines.forEach((line) => {
        const [node, left, right] = line.match(/\w+/g);
        map[node] = { node, left, right, start: node.at(2) === 'A', end: node.at(2) === 'Z' };
    });

    let current = map['AAA'];
    let count = 0;
    let dirIndex = 0;

    while (current && current.node !== 'ZZZ') {
        const dir = directions[dirIndex];

        if (dir === 'L') {
            current = map[current.left];
        } else {
            current = map[current.right];
        }
        count++;

        dirIndex++;
        if (dirIndex === directions.length) {
            dirIndex = 0;
        }
    }
    part1 = count;

    for (const node of Object.values(map)) {
        if (node.start) {
            const steps = gotoz(map, directions, node);
            part2 = lcm(part2, steps);
        }
    }

    return [part1, part2];
}

function gotoz(map, directions, node) {
    let count = 0;
    let dirIndex = 0;

    while (!node.end) {
        const dir = directions[dirIndex];

        if (dir === 'L') {
            node = map[node.left];
        } else {
            node = map[node.right];
        }
        count++;

        dirIndex++;
        if (dirIndex === directions.length) {
            dirIndex = 0;
        }
    }

    return count;
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
