const fs = require('fs');
const sscanf = require('scan.js').scan;
// @ts-ignore
const Grid = require('../utils/Grid');
// @ts-ignore
const List = require('../utils/LinkedList');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch(e) {}
const testInput = `
""
"abc"
"aaa\\"aaa"
"\\x27"
`
.trim();


function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter(line => line.length);

    let sum1 = 0;
    let sum2 = 0;
    lines.forEach((line, ix) => {
        sum1 += line.length;
        let line2 = '';
        eval('line2=' + line); // hehehe
        sum2 += line2.length;
    });

    debugger;
    part1 = sum1 - sum2;

    return [part1, part2];
}

const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));
