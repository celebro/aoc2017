const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = 0;
    const lines = input.split('\n').filter((line) => line.length);

    const instructions = lines[0].split(',');
    part1 = instructions.map((x) => hash(x)).reduce((a, b) => a + b);

    /**
     * @type {{ label: string, focal: number }[][]}
     */
    const boxes = Array.from({ length: 256 }, () => []);

    for (const instruction of instructions) {
        const [label] = instruction.split(/[-=]/);
        const boxId = hash(label);
        const op = instruction.at(label.length);
        const focal = Number(instruction.at(label.length + 1));

        const box = boxes[boxId];
        const ix = box.findIndex((lens) => lens.label === label);
        if (op === '-') {
            if (ix !== -1) {
                box.splice(ix, 1);
            }
        } else if (op === '=') {
            if (ix !== -1) {
                box[ix].focal = focal;
            } else {
                box.push({ label, focal });
            }
        }
    }

    for (let i = 0; i < boxes.length; i++) {
        const box = boxes[i];
        for (let j = 0; j < box.length; j++) {
            part2 += (i + 1) * (j + 1) * box[j].focal;
        }
    }

    return [part1, part2];
}

/**
 * @param {string} input
 */
function hash(input) {
    let h = 0;
    for (let i = 0; i < input.length; i++) {
        const ascii = input.charCodeAt(i);
        h = ((h + ascii) * 17) % 256;
    }
    return h;
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));

// 44629 too low
