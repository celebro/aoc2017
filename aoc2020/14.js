const fs = require('fs');
const sscanf = require('scan.js').scan;
// @ts-ignore
const Grid = require('../utils/Grid');
// @ts-ignore
const List = require('../utils/LinkedList');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
mem[8] = 11
mem[7] = 101
mem[8] = 0
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0n;
    let part2 = 0n;
    const lines = input.split('\n').filter((line) => line.length);

    const prog = [];
    lines.forEach((line, ix) => {
        const [str, value] = sscanf(line, '%s = %s');
        if (str === 'mask') {
            prog.push({ mask: value.split('').reverse() });
        } else {
            prog.push({ mem: +str.split(/\[|\]/)[1], value: +value });
        }
    });

    let mask;
    let memory = {};

    for (const inst of prog) {
        if (inst.mask) {
            mask = inst.mask;
        } else {
            let value = BigInt(inst.value);
            for (let i = 0; i < 36; i++) {
                if (mask[i] === '0') {
                    value = value & ~(1n << BigInt(i));
                } else if (mask[i] === '1') {
                    value = value | (1n << BigInt(i));
                }
            }
            memory[inst.mem] = value;
        }
    }

    for (const value of Object.values(memory)) {
        part1 += value;
    }

    //////////////

    memory = {};
    for (const inst of prog) {
        if (inst.mask) {
            mask = inst.mask;
        } else {
            let addr = BigInt(inst.mem);
            for (let i = 0; i < 36; i++) {
                if (mask[i] === 'X') {
                    addr = addr & ~(1n << BigInt(i));
                } else if (mask[i] === '1') {
                    addr = addr | (1n << BigInt(i));
                }
            }

            let addrs = [addr];
            for (let i = 0; i < 36; i++) {
                if (mask[i] === 'X') {
                    let to = addrs.length;
                    for (let j = 0; j < to; j++) {
                        addrs.push(addrs[j] | (1n << BigInt(i)));
                    }
                    // console.log(addrs.length);
                }
            }

            for (const addr of addrs) {
                memory[addr] = inst.value;
            }
        }
    }

    for (const value of Object.values(memory)) {
        part2 += BigInt(value);
    }

    return [part1, part2];
}

// for (const testInput of testInputs) {
//     if (testInput) {
//         const testResult = run(testInput);
//         console.log('test: ', testResult.join(' / '));
//     }
// }

const result = run(input);
console.log('result: ', result.join(' / '));
