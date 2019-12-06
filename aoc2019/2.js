const fs = require('fs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {
    console.error('failed to read file', e);
}
const testInputs = [
`1,9,10,3,2,3,11,0,99,30,40,50`,
`1,0,0,0,99`,
`2,3,0,3,99`,
`2,4,4,5,99,0`,
`1,1,1,4,99,5,6,0,99`
].map(test => test.trim());

function runComputer(input, noun, verb) {
    const mem = input.split(',').map(Number);

    if (verb !== undefined && noun !== undefined) {
        mem[1] = noun;
        mem[2] = verb;
    }

    for (let ip = 0; mem[ip] !== 99; ip += 4) {
        if (ip >= mem.length) {
            console.error('ERR: STACK OVERFLOW');
            process.exit(1);
        }
        const opcode = mem[ip];
        const p1 = mem[ip + 1];
        const v1 = mem[p1];
        const p2 = mem[ip + 2];
        const v2 = mem[p2];
        const resultP = mem[ip + 3];

        let result;
        switch (opcode) {
            case 1:
                result = v1 + v2;
                break;
            case 2:
                result = v1 * v2;
                break;
            default:
                console.error('ERR: UNKNOWN OPCODE');
                process.exit(1);
        }

        mem[resultP] = result;
    }

    return mem[0];
}

testInputs.forEach(testInput => {
    const testResult = runComputer(testInput);
    console.log('test: ', testResult);
});

console.log('result1: ', runComputer(input, 12, 2));

for (let i = 0; i <= 99; i++) {
    for (let j = 0; j <= 99; j++) {
        const result = runComputer(input, i, j);
        if (result === 19690720) {
            //too high 247800
            console.log('result2: ', 100 * i + j)
        }
    }
}
