const fs = require('fs');
const sscanf = require('scan.js').scan;
// @ts-ignore
const Grid = require('../utils/Grid');
// @ts-ignore
const List = require('../utils/LinkedList');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch(e) {}
const testInput = `
123 -> x
456 -> y
x AND y -> d
x OR y -> e
x LSHIFT 2 -> f
y RSHIFT 2 -> g
NOT x -> h
NOT y -> i
`
.trim();


const operators = [
    'AND',
    'OR',
    'LSHIFT',
    'RSHIFT',
    'NOT',
    '',
];

function part(input, forceBTo) {
    const lines = input.split('\n').filter(line => line.length);

    const wires = {};
    const gatesByInput = {};

    lines.forEach((line, ix) => {
        const [data, out] = line.split(' -> ');

        for (const op of operators) {
            if (data.indexOf(op) !== -1) {
                const gate = {
                    op: op,
                    out: out,
                    unresolved: 0,
                    params: []
                }
                let params;
                if (op === '') {
                    params = [data];
                } else {
                    params = data.split(op);
                }
                params = params.filter(x => x.length).map(x => {
                    let val = x.trim();
                    if (isNaN(+val)) {
                        const list = gatesByInput[val] = gatesByInput[val] || [];
                        list.push(gate);
                        gate.unresolved++;
                        return val;
                    } else {
                        return +val;
                    }
                });

                gate.params = params;

                if (gate.unresolved === 0) {
                    wires[gate.out] = params[0];
                }

                break;
            }
        }
    });

    if (forceBTo !== undefined) {
        wires.b = forceBTo;
    }

    const resolved = Object.keys(wires);

    while (resolved.length > 0) {
        const wire = resolved.pop();

        const toResolve = gatesByInput[wire];
        if (toResolve) {
            toResolve.forEach(gate => {
               gate.unresolved--;
               if (gate.unresolved === 0) {
                   let output;
                   let in1 = typeof gate.params[0] === 'number' ? gate.params[0] : wires[gate.params[0]];
                   let in2 = typeof gate.params[1] === 'number' ? gate.params[1] : wires[gate.params[1]];
                   switch (gate.op) {
                        case 'AND': output = in1 & in2; break;
                        case 'OR': output = in1 | in2; break;
                        case 'LSHIFT': output = in1 << in2; break;
                        case 'RSHIFT': output = in1 >> in2; break;
                        case 'NOT': output = ~in1; break;
                        case '': output = in1; break;
                   }
                   output = output & ((1 << 16) - 1)
                   wires[gate.out] = output;
                   resolved.push(gate.out);
               }
            });
            toResolve.length = 0;
        }
    }

    return wires.a;
}

function run(input) {
    let part1 = part(input);
    let part2 = part(input, part1);

    return [part1, part2];
}

// const testResult = run(testInput);
// console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));
