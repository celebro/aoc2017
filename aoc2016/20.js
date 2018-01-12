const fs = require('fs');

const input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInput = `
5-8
0-2
4-7
`.trim();

function run(input, max) {
    let part1 = 0;
    let part2 = 0;


    const rules = input
    .split('\n')
    .filter(line => line.length)
    .map((line) => {
        return line.split('-').map(Number);
    });

    rules.sort((a, b) => {
        return a[0] - b[0];
    })

    let min = 0;
    let sum = 0;

    rules.forEach(([a, b]) => {
        if (a <= min) {
            min = Math.max(min, b + 1);
        } else {
            sum += a - min;
            min = b + 1;
        }
    })

    sum += Math.max(max - min + 1, 0);

    part1 = min;
    part2 = sum;

    return [part1, part2];
}

const testResult = run(testInput, 9);
console.log('test: ', testResult.join(' / '));

const result = run(input, 4294967295);
console.log('result: ', result.join(' / '));
// > 4534266
