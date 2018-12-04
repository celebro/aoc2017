const fs = require('fs');
const Grid = require('../utils/Grid');
const sscanf = require('scan.js').scan;

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch(e) {}
const testInput = `
#1 @ 1,3: 4x4
#2 @ 3,1: 4x4
#3 @ 5,5: 2x2
`
.trim()
.replace(/, /g, '\n');


function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter(line => line.length);

    const map = new Grid(() => 0);
    lines.forEach((line, ix) => {
        const [id, x, y, w, h] = sscanf(line, '#%d @ %d,%d: %dx%d');

        for (let i = x; i < x + w; i++) {
            for (let j = y; j < y + h; j++) {
                map.set(i, j, map.get(i, j) + 1);
            }
        }
    });

    let sum = 0;
    // todo should not invoke default getter
    // todo util for slice (double for loop)
    map.forEach(value => {
        if (value > 1) {
            sum++;
        }
    });
    part1 = sum;


    lines.forEach((line, ix) => {
        const [id, x, y, w, h] = sscanf(line, '#%d @ %d,%d: %dx%d');

        let all = true;
        for (let i = x; i < x + w; i++) {
            for (let j = y; j < y + h; j++) {
                if (map.get(i, j) !== 1) {
                    all = false;
                }
            }
        }
        if (all) {
            part2 = id;
        }
    });


    return [part1, part2];
}

const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));
