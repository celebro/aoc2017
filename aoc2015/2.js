const fs = require('fs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch(e) {}
const testInput = `
2x3x4
`
.trim()
.replace(/, /g, '\n');


function run(input) {
    let part1 = 0;
    let part2 = 0;
    const lines = input.split('\n').filter(line => line.length);

    lines.forEach((line, ix) => {
        const [l, w, h] = line.split('x').map(x => +x);
        part1 += 2 * l * w + 2 * w * h + 2 * h * l;
        part1 += Math.min(l * w, l * h, w * h);

        part2 += 2 * Math.min(l + w, l + h, w + h);
        part2 += l * w * h;
    });

    return [part1, part2];
}

const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));
