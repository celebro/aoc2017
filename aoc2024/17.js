const fs = require('fs');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

function runInputProgram(program, regA, regB, regC, part) {
    let ip = 0;
    let output = [];

    function readCombo() {
        let operand = program[ip + 1];
        let value = 0;
        switch (operand) {
            case 4:
                value = regA;
                break;
            case 5:
                value = regB;
                break;
            case 6:
                value = regC;
                break;
            default:
                value = operand;
        }
        return value;
    }

    function readLiteral() {
        return program[ip + 1];
    }

    while (true) {
        let opcode = program[ip];
        if (opcode === undefined) {
            break;
        }

        switch (opcode) {
            case 0: // adv
                regA = (regA / 2 ** readCombo()) | 0;
                break;
            case 1: // blx
                regB = regB ^ readLiteral();
                break;
            case 2: // bst
                regB = readCombo() % 8;
                break;
            case 3: // jnz
                if (regA !== 0) {
                    ip = readLiteral();
                    continue;
                }
                break;
            case 4: // bxc
                regB = regB ^ regC;
                break;
            case 5: // out
                output.push(readCombo() % 8);
                if (part === 2) {
                    let len = output.length;
                    if (output[len - 1] !== program[len - 1]) {
                        return false;
                    }
                    if (output.length === program.length) {
                        return true;
                    }
                }
                break;
            case 6: // bdv
                regB = (regA / 2 ** readCombo()) | 0;
                break;
            case 7: //cdv
                regC = (regA / 2 ** readCombo()) | 0;
                break;
        }

        ip += 2;
    }

    if (part === 1) {
        return output.join(',');
    } else {
        return output.length === program.length;
    }
}

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    let lines = readInput(input);

    let regA = 0;
    let regB = 0;
    let regC = 0;
    let program = [];

    for (let lineIx = 0; lineIx < lines.length; lineIx++) {
        let line = lines[lineIx];
        if (line.startsWith('Register A: ')) {
            regA = +line.split(': ')[1];
        } else if (line.startsWith('Register B: ')) {
            regB = +line.split(': ')[1];
        } else if (line.startsWith('Register C: ')) {
            regC = +line.split(': ')[1];
        } else if (line.startsWith('Program: ')) {
            program = line
                .split(': ')[1]
                .split(',')
                .map((x) => +x);
        }
    }

    part1 = runInputProgram(program, regA, regB, regC, 1);

    for (let i = 0; ; i++) {
        if (i % 1_000_000 === 0) {
            console.log(`${i / 1_000_000}M`);
        }
        if (runInputProgram(program, i, regB, regC, 2)) {
            part2 = i;
            break;
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
