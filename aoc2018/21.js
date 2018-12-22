const fs = require('fs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch(e) {}


function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter(line => line.length);

    let ipidx = 0;
    const program = [];

    lines.forEach(line => {
        if (line.startsWith('#ip')) {
            ipidx = +line.split(' ')[1];
        } else {
            const split = line.split(' ');
            program.push({
                op: split[0],
                a: +split[1],
                b: +split[2],
                c: +split[3]
            });
        }
    });

    let regs = [0, 0, 0, 0, 0, 0];
    const set = new Set();
    let last = 0;

    while (program[regs[ipidx]]) {
        const inst = program[regs[ipidx]];
        const opcode = inst.op;

        if (regs[5] === 28) { // determined by manual input inspection
            if (part1 === undefined) {
                part1 = regs[4];
            }

            if (set.has(regs[4])) {
                part2 = last;
                break;
            }
            last = regs[4]
            set.add(last);
        }



        let a, b, c;

        if (opcode[2] === 'i' || opcode === 'seti') {
            a = inst.a;
        } else {
            a = regs[inst.a];
        }

        if (opcode[3] === 'i') {
            b = inst.b;
        } else {
            b = regs[inst.b];
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

        regs[inst.c] = c;
        regs[ipidx] += 1;
    }

    return [part1, part2];
}

const result = run(input);
console.log('result: ', result.join(' / '));
