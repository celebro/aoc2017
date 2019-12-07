const fs = require('fs');
const { permute } = require('../utils/permute');
const Computer = require('./computer');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}

function getAmpOutput(code, permutation) {
    let lastOutput = 0;
    for (let i = 0; i < 5; i++) {
        const computer = new Computer(code);
        lastOutput = computer.runWithInput([permutation[i], lastOutput]);
    }
    return lastOutput;
}

function getFeedbackAmpOutput(code, permutation) {
    const cluster = [];
    for (let i = 0; i < 5; i++) {
        const computer = new Computer(code);
        computer.addInput(permutation[i]);
        if (i === 0) {
            computer.addInput(0);
        }
        cluster[i] = computer;
    }

    let lastOutput;
    let index = 0;
    while (true) {
        const computer = cluster[index];
        if (computer.isHalted) {
            break;
        }

        const output = computer.run();

        if (index === 4) {
            lastOutput = output[output.length - 1];
        }

        const nextComputer = cluster[(index + 1) % 5];
        nextComputer.addInput(...output);
        index = (index + 1) % 5;
    }

    return lastOutput;
}

function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const code = input.split('\n').filter(line => line.length)[0];

    part1 = Math.max(...permute([0, 1, 2, 3, 4]).map(permutation => getAmpOutput(code, permutation)));
    part2 = Math.max(...permute([5, 6, 7, 8, 9]).map(permutation => getFeedbackAmpOutput(code, permutation)));

    return [part1, part2];
}

console.log('test1: ', getAmpOutput('3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0', [4, 3, 2, 1, 0]), '(43210)');
console.log('test1: ', getAmpOutput('3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0', [0, 1, 2, 3, 4]), '(54321)');
console.log(
    'test1: ',
    getAmpOutput('3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0', [1, 0, 4, 3, 2]),
    '(65210)'
);

console.log(
    'test2: ',
    getFeedbackAmpOutput('3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5', [9, 8, 7, 6, 5]),
    '(139629729)'
);
console.log(
    'test2: ',
    getFeedbackAmpOutput(
        `3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,
-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,
53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10`,
        [9, 7, 8, 5, 6]
    ),
    '(18216)'
);

const result = run(input);
console.log('result: ', result.join(' / '));
