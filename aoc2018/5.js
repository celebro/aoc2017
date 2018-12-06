const fs = require('fs');
const sscanf = require('scan.js').scan;

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch(e) {}
const testInput = `
dabAcCaCBAcCcaDA
`
.trim()
.replace(/, /g, '\n');


function run(input) {
    let part1 = undefined;
    let part2 = Infinity;
    const line = input.split('\n').filter(line => line.length)[0];


    console.time('part1');
    let result1 = react(line.split('').map(char => char.codePointAt(0)), 0);
    part1 = result1.length;
    result1.stack.length = result1.length;
    console.timeEnd('part1')

    console.time('part2');
    for (let codePoint = 'A'.codePointAt(0); codePoint < 'Z'.codePointAt(0); codePoint++) {
        part2 = Math.min(part2, react(result1.stack, codePoint).length)
    }

    console.timeEnd('part2');

    return [part1, part2];
}

/**
 *
 * @param {array} input
 */
function react(input, ignore) {
    let stack = new Array(input.length);
    let length = 0;

    for (let i = 0; i < input.length; i++) {
        let c = input[i];
        if (c === ignore || c === ignore + 32) {
            continue;
        }

        stack[length++] = input[i];

        while (true) {
            if (length < 2) break;

            const n1 = stack[length - 1];
            const n2 = stack[length - 2];

            if (Math.abs(n1 - n2) === 32) {
                length = length - 2;
            } else {
                break;
            }
        }
    }

    return { length, stack };
}

const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));
