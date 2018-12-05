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

    let set = new Set();
    for (const char of line) {
        set.add(char.toLowerCase());
    }

    part1 = react(line);
    // console.time('time');

    for (let char of set) {
        const filtered = line.replace(new RegExp(char, 'gi'), '');
        part2 = Math.min(part2, react(filtered))
    }

    // console.timeEnd('time');

    return [part1, part2];
}

/**
 *
 * @param {string} str
 */
function react(str) {
    let stack = new Array(str.length);
    let length = 0;

    const caseDiff =  Math.abs('a'.codePointAt(0) - 'A'.codePointAt(0));

    for (let i = 0; i < str.length; i++) {
        stack[length++] = str.codePointAt(i);

        while (true) {
            if (length < 2) break;

            const n1 = stack[length - 1];
            const n2 = stack[length - 2];

            if (Math.abs(n1 - n2) === caseDiff) {
                length = length - 2;
            } else {
                break;
            }
        }
    }

    return length;
}

const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));
