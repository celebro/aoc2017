const fs = require('fs');

const input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInput = `
cpy 41 a
inc a
inc a
dec a
jnz a 2
dec a
`.trim();

function run(input) {
    let part1 = 0;
    let part2 = 0;

    const code = input
        .split('\n')
        .filter(line => line.length)
        .map((line) => {
            return line.split(' ');
        });


    function run(state) {
        let ptr = 0;
        let lastOut = 1;
        let valid = true;
        let cnt = 0;

        while (ptr >= 0 && ptr < code.length && valid && cnt < 10000000) {
            const [cmd, op1, op2] = code[ptr];

            const val1 = isNaN(op1) ? state[op1] : +op1;
            const val2 = isNaN(op2) ? state[op2] : +op2;

            switch (cmd) {
                case 'cpy':
                    state[op2] = val1;
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
                case 'out':
                    if (lastOut + val1 !== 1) {
                        valid = false;
                    }
                    lastOut = val1;
                    break;
                default:
                    console.error('undefined command');
                    process.exit(1);
            }
            ptr = ptr + 1;
            cnt += 1;
        }

        return valid;
    }

    let done = false;
    let i = 1;
    while (!done) {
        done = run({ a: i, b: 0, c: 0, d: 0 });
        i++;
    }

    part1 = i - 1;


    return [part1, part2];
}

const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));
