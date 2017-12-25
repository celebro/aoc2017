const fs = require('fs');

const input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();


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

    function prog() {
        const regs = { };
        let ix = 0;
        let count = 0;

        while (ix >= 0 && ix < lines.length) {
            const [code, op1, op2] = lines[ix];

            const val1 = getValue(op1, regs);
            const val2 = getValue(op2, regs);

            switch (code) {
                case 'set':
                    regs[op1] = val2;
                    ix = ix + 1;
                    break;
                case 'sub':
                    regs[op1] = val1 - val2;
                    ix = ix + 1;
                    break;
                case 'mul':
                    regs[op1] = val1 * val2;
                    ix = ix + 1;
                    count++;
                    break;
                case 'jnz':
                    if (val1 !== 0) {
                        ix = ix + val2;
                    } else {
                        ix = ix + 1;
                    }
                    break;
                default:
                    console.log('err');
                    process.exit();
            }
        }

        return count;
    }

    part1 = prog()

    let b = 0,
        c = 0,
        // d = 0,
        // e = 0,
        f = 0,
        h = 0;

    b = 105700;
    c = 122700;

    do {
        f = 1;

        for (let num = 2; num * num <= b; num++) {
            if (b % num === 0) {
                f = 0;
                break;
            }
        }

        // d = 2;
        // do {
        //     e = 2; // 11
        //     do {
        //         if (d * e === b) {
        //             f = 0;
        //             break;
        //         }
        //         e++;
        //     } while (e !== b);

        //     if (f === 0) {
        //         break;
        //     }

        //     d++;
        // } while (d !== b)

        if (f === 0) {
            h++;
        }

        if (b === c) {
            break;
        }

        b += 17;
    } while (true);

    part2 = h;

    return [part1, part2];
}

// const testResult = run(testInput);
// console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));
