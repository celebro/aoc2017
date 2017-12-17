const fs = require('fs');

const input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInput = `

`.trim();

function run(input) {
    let part1 = 0;
    let part2 = 0;

    const lines = input.split('\n').map((line, ix) => {

    });

    return [part1, part2];
}

const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));
