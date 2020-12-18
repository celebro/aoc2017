const { debug } = require('console');
const fs = require('fs');
const sscanf = require('scan.js').scan;
// @ts-ignore
const Grid = require('../utils/Grid');
// @ts-ignore
const List = require('../utils/LinkedList');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
inc a
jio a, +2
tpl a
inc a
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

    const instructions = [];

    lines.forEach((line, ix) => {
        let [op, reg, jmp] = sscanf(line, '%s %s %d');
        if (op === 'jmp') {
            jmp = +reg;
            reg = '';
        }
        instructions.push({ op, reg: reg.replace(',', ''), jmp: jmp || 0 });
        // console.log(instructions[instructions.length - 1]);
    });

    part1 = runProg(
        {
            a: 0,
            b: 0
        },
        instructions
    ).b;

    part2 = runProg(
        {
            a: 1,
            b: 0
        },
        instructions
    ).b;

    return [part1, part2];
}

function runProg(regs, instructions) {
    let ip = 0;

    while (instructions[ip]) {
        const instr = instructions[ip];
        const { op, reg, jmp } = instr;

        switch (op) {
            case 'hlf':
                regs[reg] /= 2;
                ip++;
                break;
            case 'tpl':
                regs[reg] *= 3;
                ip++;
                break;
            case 'inc':
                regs[reg]++;
                ip++;
                break;
            case 'jmp':
                ip += jmp;
                break;
            case 'jie':
                if (regs[reg] % 2 === 0) {
                    ip += jmp;
                } else {
                    ip++;
                }
                break;
            case 'jio':
                if (regs[reg] === 1) {
                    ip += jmp;
                } else {
                    ip++;
                }
                break;
            default:
                process.exit(1);
        }
    }

    return regs;
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
