const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
x00: 0
x01: 1
x02: 0
x03: 1
x04: 0
x05: 1
y00: 0
y01: 0
y02: 1
y03: 1
y04: 0
y05: 1

x00 AND y00 -> z05
x01 AND y01 -> z02
x02 AND y02 -> z01
x03 AND y03 -> z03
x04 AND y04 -> z04
x05 AND y05 -> z00
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = undefined;
    let lines = readInput(input);

    let values = {};
    let gates = {};

    for (let lineIx = 0; lineIx < lines.length; lineIx++) {
        let line = lines[lineIx];
        if (line.includes(':')) {
            let [name, value] = line.split(': ');
            values[name] = parseInt(value);
        }
        if (line.includes('->')) {
            let [a, op, b, name] = sscanf(line, '%s %s %s -> %s');
            gates[name] = { a, op, b };
        }
    }

    function resolve(name) {
        if (name in values) {
            return values[name];
        }
        let gate = gates[name];
        if (!gate) {
            return undefined;
        }

        switch (gate.op) {
            case 'AND':
                return resolve(gate.a) & resolve(gate.b);
            case 'OR':
                return resolve(gate.a) | resolve(gate.b);
            case 'XOR':
                return resolve(gate.a) ^ resolve(gate.b);
            default:
                throw new Error('Unknown op: ' + gate.op);
        }
    }

    for (let i = 0; ; i++) {
        let name = `z${i.toString().padStart(2, '0')}`;
        let value = resolve(name);
        if (value === undefined) {
            break;
        }
        part1 = part1 + 2 ** i * value;
    }

    //================

    function switchGates(name1, name2) {
        let tmp = gates[name1];
        gates[name1] = gates[name2];
        gates[name2] = tmp;
    }

    // solved manually by inspecting print output
    switchGates('z05', 'hdt');
    switchGates('z09', 'gbf');
    switchGates('mht', 'jgt');
    switchGates('nbf', `z30`);
    part2 = ['z05', 'hdt', 'z09', 'gbf', 'mht', 'jgt', 'nbf', `z30`].sort().join(',');

    let depthCache = {};
    function depth(name) {
        if (depthCache[name]) {
            return depthCache[name];
        }
        let gate = gates[name];
        if (!gate) {
            return 0;
        }

        let a = depth(gate.a);
        let b = depth(gate.b);
        let d = Math.max(a, b) + 1;
        depthCache[name] = d;
        return d;
    }

    let seen = new Set();
    function print(name, level) {
        let gate = gates[name];
        if (!gate) {
            console.log('  '.repeat(level) + name);
            return;
        }

        let indent = '  '.repeat(level);
        console.log(`${indent}${name} = ${gate.op} (${gate.a}, ${gate.b})`);

        if (seen.has(gate)) {
            console.log(`${indent}  ...`);
            return;
        }
        seen.add(gate);
        if (depth(gate.a) > depth(gate.b) || (depth(gate.a) === depth(gate.b) && gate.a > gate.b)) {
            print(gate.b, level + 1);
            print(gate.a, level + 1);
        } else {
            print(gate.a, level + 1);
            print(gate.b, level + 1);
        }
    }

    for (let i = 0; ; i++) {
        let name = createName('z', i);
        if (!gates[name]) {
            break;
        }

        print(name, 0);
        console.log('==============');
        // console.log(name, deps);
    }

    // validate - detects which zXX has wrong result
    // possible automatic solution:
    //  - validate from lowest bit to highest
    //  - if a bit is correct, mark all used gates as correct
    //  - if a bit is incorrect, try switching any gate used in that bit, that wasn't marked as correct by previous bit until result is correct
    for (let i = 1; ; i++) {
        let name = createName('z', i);
        if (!gates[name]) {
            break;
        }

        for (let j = 0; j <= i; j++) {
            values[createName('x', j)] = 0;
            values[createName('y', j)] = 0;
        }

        for (let { x, y, z } of expect) {
            values[createName('x', i)] = x[0];
            values[createName('x', i - 1)] = x[1];

            values[createName('y', i)] = y[0];
            values[createName('y', i - 1)] = y[1];

            let value = resolve(createName('z', i));
            if (value !== z) {
                console.log('Failed', name);
            }
        }
    }

    return [part1, part2];
}

let expect = [
    {
        x: [0, 0],
        y: [0, 0],
        z: 0
    },
    {
        x: [1, 0],
        y: [0, 0],
        z: 1
    },
    {
        x: [1, 0],
        y: [1, 0],
        z: 0
    },
    {
        x: [0, 1],
        y: [0, 0],
        z: 0
    },
    {
        x: [1, 1],
        y: [0, 0],
        z: 1
    },
    {
        x: [1, 1],
        y: [1, 0],
        z: 0
    },
    {
        x: [0, 1],
        y: [0, 1],
        z: 1
    },
    {
        x: [1, 1],
        y: [0, 1],
        z: 0
    },
    {
        x: [1, 1],
        y: [1, 1],
        z: 1
    }
];

function createName(zyx, num) {
    return `${zyx}${num.toString().padStart(2, '0')}`;
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

// for (const testInput of testInputs) {
//     if (testInput) {
//         const testResult = run(testInput);
//         console.log('test: ', testResult.join(' / '));
//     }
// }

const result = run(input);
console.log('result: ', result.join(' / '));
