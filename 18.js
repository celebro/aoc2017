const fs = require('fs');

const input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInput = `
set a 1
add a 2
mul a a
mod a 5
snd a
set a 0
rcv a
jgz a -1
set a 1
jgz a -2
`.trim();

function getValue(op, regs) {
    let result = +op;
    if (isNaN(result)) {
        result = regs[op] || 0;
    }
    return result;
}

function run(input) {
    let part1 = 0;
    let part2 = 0;

    const lines = input.split('\n').map(line => line.split(' '));

    function prog(part) {
        const exec = [{
            regs: { p: 0 },
            stack: [],
            ix: 0
        }, {
            regs: { p: part === 2 ? 1 : 0 },
            stack: [],
            ix: 0
        }]

        let progId = 0;
        let count = 0;

        while (!(exec[progId].done || exec[progId].block)) {
            const inst = exec[progId];
            const othr = exec[(progId + 1) % 2];

            let { regs, stack, ix } = inst;
            if (!lines[ix]) {
                inst.done = true;
                progId = (progId + 1) % 2;
                continue;
            }

            const [code, op1, op2] = lines[ix];

            const val1 = getValue(op1, regs);
            const val2 = getValue(op2, regs);

            switch (code) {
                case 'snd':
                    othr.stack.push(val1);
                    othr.block = false;
                    ix = ix + 1;
                    if (progId === 1) {
                        count++;
                    }
                    break;
                case 'set':
                    regs[op1] = val2;
                    ix = ix + 1;
                    break;
                case 'add':
                    regs[op1] = val1 + val2;
                    ix = ix + 1;
                    break;
                case 'mul':
                    regs[op1] = val1 * val2;
                    ix = ix + 1;
                    break;
                case 'mod':
                    regs[op1] = val1 % val2;
                    ix = ix + 1;
                    break;
                case 'rcv':
                    if (part === 1) {
                        if (val1 > 0) {
                            inst.done = true;
                            othr.done = true;
                            count = othr.stack.pop();
                        }
                        ix = ix + 1;
                    } else {
                        if (stack.length > 0) {
                            regs[op1] = stack.shift();
                            ix = ix + 1;
                        } else {
                            inst.block = true;
                            progId = (progId + 1) % 2;
                        }
                    }
                    break;
                case 'jgz':
                    if (val1 > 0) {
                        ix = ix + val2;
                    } else {
                        ix = ix + 1;
                    }
                    break;
            }

            inst.ix = ix;
        }

        return count;
    }

    part1 = prog(1)
    part2 = prog(2);

    return [part1, part2];
}

const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));
