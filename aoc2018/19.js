const fs = require('fs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch(e) {}
const testInput = `
#ip 0
seti 5 0 1
seti 6 0 2
addi 0 1 0
addr 1 2 3
setr 1 0 0
seti 8 0 4
seti 9 0 5
`
.trim();

function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter(line => line.length);

    let regs = [0, 0, 0, 0, 0, 0];
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

    while (regs[ipidx] >= 0 &&  regs[ipidx] < program.length) {
        const inst = program[regs[ipidx]];
        const opcode = inst.op;

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

    part1 = regs[0];

    if (input !== testInput) {
        let r0 = 0, r1 = 0, r2 = 0, r3 = 0, r4 = 0;

        // jumps here  // addi 5 16 5

        r2 = r2 + 2;    // addi 2 2 2
        r2 = r2 * r2;   // mulr 2 2 2
        r2 = 19 * r2;   // mulr 5 2 2
        r2 = r2 * 11;   // muli 2 11 2

        r1 = r1 + 8;    // addi 1 8 1
        r1 = r1 * 22;   // mulr 1 5 1
        r1 = r1 + 18;   // addi 1 18 1

        r2 = r2 + r1; // addr 2 1 2
        // skip r0 steps // addr 5 0 5
        // skipped      // seti 0 7 5
        r1 = 27;        // setr 5 0 1
        r1 = r1 * 28;   // mulr 1 5 1
        r1 = 29 + r1;   // addr 5 1 1
        r1 = 30 * r1;   // mulr 5 1 1
        r1 = r1 * 14;   // muli 1 14 1
        r1 = r1 * 32;   // mulr 1 5 1
        r2 = r2 + r1;   // addr 2 1 2

        r0 = 0;         // seti 0 0 0

        /*
        // jumps here   // seti 0 9 5

        r4 = 1;         // seti 1 8 4
        do {
            r3 = 1;         // seti 1 5 3
            // loop
            do {
                // r1 = r4 * r3;   // mulr 4 3 1

                // r1 = r1 === r2 ? 1 : 0; // eqrr 1 2 1
                                // addr 1 5 5
                                // addi 5 1 5
                if (r4 * r3 === r2) {
                    r0 = r4 + r0; // addr 4 0 0
                }

                r3 = r3 + 1;    // addi 3 1 3

                // r1 = r3 > r2 ? 1 : 0;   // gtrr 3 2 1
                // addr 5 1 5
                // seti 2 5 5
            } while (r3 <= r2);

            r4 = r4 + 1;            // addi 4 1 4
            r1 = r4 > r2 ? 1 : 0;   // gtrr 4 2 1
        // addr 1 5 5
        // seti 1 2 5
        } while (r4 <= r2);
        // exit  // mulr 5 5 5
        */

        const sqrt = Math.sqrt(r2);
        let sum = 0;
        for (let i = 1; i <= sqrt; i++) {
            if (r2 % i === 0) {
                sum = sum + i + (r2 / i);
            }
        }
        part2 = sum;
    }

    return [part1, part2];
}

const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));
