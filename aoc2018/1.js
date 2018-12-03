const fs = require('fs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch(e) {}
const testInput = `
7, +7, -2, -7, -4
`
.trim()
.replace(/, /g, '\n');


function run(input) {
    let sum = 0;
    let part1 = undefined;
    let part2 = undefined;
    const set = new Set();

    const lines = input.split('\n').filter(line => line.length);

    while (part2 === undefined) {
            lines.some((line, ix) => {
                const v = +(line);
                sum += v;
                if (set.has(sum) && part2 === undefined) {
                    part2 = sum;
                    return true;
                }
                set.add(sum);
            });
            if (part1 == undefined) {
                part1 = sum;
            }
    }

    return [part1, part2];
}

const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));
