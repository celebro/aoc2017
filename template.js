const fs = require('fs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch(e) {}
const testInput = `

`
.trim()
.replace(/, /g, '\n');


function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter(line => line.length);

    lines.forEach((line, ix) => {

    });

    return [part1, part2];
}

const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));
