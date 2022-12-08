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
    [D]
[N] [C]
[Z] [M] [P]
 1   2   3

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2
`
];

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = '';
    let part2 = '';
    const lines = input.split('\n');

    const stacks = [[]];
    let stacks2;

    lines.forEach((line, ix) => {
        if (line.startsWith('move')) {
            stacks2 = stacks2 || structuredClone(stacks);

            const [num, from, to] = sscanf(line, 'move %d from %d to %d');
            for (let i = 0; i < num; i++) {
                const crate = stacks[from - 1].pop();
                stacks[to - 1].push(crate);
            }

            const moved = stacks2[from - 1].splice(-num);
            stacks2[to - 1].push(...moved);
        } else if (line) {
            const boxes = line.match(/.{3,4}/g);
            for (let i = 0; i < (boxes ? boxes.length : 0); i++) {
                const box = boxes[i];
                if (box.startsWith('[')) {
                    if (!stacks[i]) {
                        stacks[i] = [];
                    }
                    stacks[i].unshift(box.charAt(1));
                }
            }
        }
    });

    for (const stack of stacks) {
        part1 += stack.at(-1);
    }
    for (const stack of stacks2) {
        part2 += stack.at(-1);
    }

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
