const fs = require('fs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch(e) {}
const testInput = `
Before: [3, 2, 1, 1]
9 2 1 2
After:  [3, 2, 2, 1]
`
.trim();


const opcodes = [
    'addr',
    'addi',
    'mulr',
    'muli',
    'banr',
    'bani',
    'borr',
    'bori',
    'setr',
    'seti',
    'gtir',
    'gtri',
    'gtrr',
    'eqir',
    'eqri',
    'eqrr'
]

function handleInstruction(opcode, params, inregs, outregs) {
    let a, b, c;

    if (opcode[2] === 'i' || opcode === 'seti') {
        a = params[1];
    } else {
        a = inregs[params[1]];
    }

    if (opcode[3] === 'i') {
        b = params[2];
    } else {
        b = inregs[params[2]];
    }

    switch (opcode.substring(0, 2)) {
        case 'ad': c = a + b; break;
        case 'mu': c = a * b; break;
        case 'ba': c = a & b; break;
        case 'bo': c = a | b; break;
        case 'se': c = a; break;
        case 'gt': c = a > b ? 1 : 0; break;
        case 'eq': c = a === b ? 1 : 0; break;
    }

    outregs[params[3]] = c;
}

function run(input) {
    let part1 = 0;
    let part2 = undefined;
    const lines = input.split('\n').filter(line => line.length);

    let samples = [];
    let program = [];


    // Read
    let ix = 0;
    while (lines[ix] && lines[ix].startsWith('Before')) {
        const sample = {
            before: lines[ix].substring(9, 19).split(', ').map(x => +x),
            after: lines[ix + 2].substring(9, 19).split(', ').map(x => +x),
            params: lines[ix + 1].split(' ').map(x => +x)
        };
        samples.push(sample);
        ix += 3;
    }

    while(lines[ix]) {
        program.push(lines[ix].split(' ').map(x => +x));
        ix++;
    }


    // Find which opcodes match each opcode numbers
    const matchesMap = {};
    for (const sample of samples) {
        let { before, after, params } = sample;
        const matches = [];

        for (const opcode of opcodes) {
            const result = before.slice();
            handleInstruction(opcode, params, before, result)
            if (after.join(' ') === result.join(' ')) {
                matches.push(opcode);
            }
        }

        if (matches.length >= 3) {
            part1++;
        }

        const opnum = params[0];
        if (opnum in matchesMap) {
            // Intersection
            matchesMap[opnum] = matchesMap[opnum].filter(x => matches.indexOf(x) !== -1);
        } else {
            matchesMap[opnum] = matches;
        }
    }


    // Match opnums to their opcodes
    const opcodeMap = {};
    const matchedOpcodes = new Set();

    let change = true;
    while (change) {
        change = false;
        Object.entries(matchesMap).forEach(entry => {
            let [opnum, matches] = entry;

            if (matches.length > 1) {
                entry[1] = matches = matches.filter(x => !matchedOpcodes.has(x));
            }

            if (matches.length === 1) {
                const opcode = matches[0];
                matchedOpcodes.add(opcode);
                opcodeMap[opnum] = opcode;
                matches.length = 0;
                change = true;
            }
        });
    }


    // Run program
    const registers = [0, 0, 0, 0];
    for (const line of program) {
        const op = opcodeMap[line[0]];
        handleInstruction(op, line, registers, registers);
    }
    part2 = registers[0];


    return [part1, part2];
}

const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));
