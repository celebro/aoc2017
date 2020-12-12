const fs = require('fs');
const sscanf = require('scan.js').scan;

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6
`
].map((x) => x.trim());

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter((line) => line.length);

    const prog = [];

    lines.forEach((line, ix) => {
        const [op, param] = sscanf(line, '%s %d');
        prog.push({ op, param });
    });

    const prog1 = { ip: 0, acc: 0, visited: {}, prog: prog };
    while (!prog1.visited[prog1.ip]) {
        runOne(prog1);
    }
    part1 = prog1.acc;

    //////////////
    console.time('part2');
    let progs = [];
    for (let i = 0; i < prog.length; i++) {
        const op = prog[i].op;
        if (op === 'nop' || op === 'jmp') {
            const newProg = [...prog];
            newProg[i] = { ...prog[i], op: op === 'nop' ? 'jmp' : 'nop' };
            progs.push({ prog: newProg, ip: 0, acc: 0, visited: {}, terminated: false, repeats: false });
        }
    }

    while (part2 === undefined) {
        for (const prog of progs) {
            runOne(prog);

            if (prog.terminated) {
                part2 = prog.acc;
            }
        }

        progs = progs.filter((x) => !x.repeats);
    }
    console.timeEnd('part2');

    return [part1, part2];
}

function runOne(instance) {
    const line = instance.prog[instance.ip];
    if (!line) {
        instance.terminated = true;
        return;
    }

    const { op, param } = line;
    instance.visited[instance.ip] = true;

    switch (op) {
        case 'acc':
            instance.acc += param;
            instance.ip += 1;
            break;
        case 'jmp':
            instance.ip += param;
            break;
        case 'nop':
            instance.ip += 1;
            break;
    }

    if (instance.visited[instance.ip]) {
        instance.repeats = true;
    }
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
