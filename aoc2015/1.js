const fs = require('fs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch(e) {}
const testInput = `
))(((((
`
.trim()
.replace(/, /g, '\n');


function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter(line => line.length);

    let cnt = 0;
    lines[0].split('').forEach((char, ix) => {
        if (char === '(') {
            cnt++;
        } else if (char === ')') {
            cnt--;
        }
        if (cnt === -1 && part2 === undefined) {
            part2 = ix + 1;
        }
    });
    part1 = cnt;

    return [part1, part2];
}

const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));
