const fs = require('fs');

const input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInput = `
cpy 2 a
tgl a
tgl a
tgl a
cpy 1 a
dec a
dec a
`.trim();

function run(input) {
    let part1 = 0;
    let part2 = 0;

    let baseCode = input
        .split('\n')
        .filter(line => line.length)
        .map((line) => {
            return line.split(' ');
        });

    const tglMap = {
        inc: 'dec',
        dec: 'inc',
        tgl: 'inc',
        jnz: 'cpy',
        cpy: 'jnz'
    }

    function run(state, code) {
        let ptr = 0;

        while (ptr >= 0 && ptr < code.length) {
            const [cmd, op1, op2] = code[ptr];

            const val1 = isNaN(op1) ? state[op1] : +op1;
            const val2 = isNaN(op2) ? state[op2] : +op2;

            switch (cmd) {
                case 'cpy':
                    if (isNaN(op2)) {
                        state[op2] = val1;
                    }
                    break;
                case 'inc':
                    state[op1]++;
                    break;
                case 'dec':
                    state[op1]--;
                    break;
                case 'jnz':
                    if (val1 !== 0) {
                        ptr = ptr + val2 - 1;
                    }
                    break;
                case 'tgl':
                    const ix = ptr + val1;
                    if (ix > 0 && ix < code.length) {
                        let line = code[ix];
                        let newCmd = tglMap[line[0]];
                        const newLine = [newCmd, ...line.slice(1)]
                        code[ix] = newLine;
                    }
                    break;
                default:
                    console.error('undefined command');
                    process.exit(1);
            }
            ptr = ptr + 1;
        }

        return state.a;
    }

    // part1 = run({ a: 7, b: 0, c: 0, d: 0 }, baseCode.slice());
    part2 = run({ a: 12, b: 0, c: 0, d: 0 }, baseCode.slice());

    return [part1, part2];
}

// const testResult = run(testInput);
// console.log('test: ', testResult.join(' / '));

console.log('This is going to take a while ...');
const result = run(input);
console.log('result: ', result.join(' / '));
