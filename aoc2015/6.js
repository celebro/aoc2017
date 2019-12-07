const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/FixedGrid');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch(e) {}
const testInput = `

`
.trim();


/**
 *
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter(line => line.length);

    const map1 = new Grid(1000, 1000, false);
    const map2 = new Grid(1000, 1000, 0);

    lines.forEach((line, ix) => {
        let data;
        let type = 0;
        if (line.startsWith('toggle')) {
            data = line.substring(7);
            type = 1;
        } else if (line.startsWith('turn on')) {
            data = line.substring(8);
            type = 2;
        } else {
            data = line.substring(9);
            type = 3;
        }
        const [x1, y1, x2, y2] = sscanf(data, '%d,%d through %d,%d');

        map1.forSlice(x1, y1, x2 - x1 + 1, y2 - y1 + 1, (value, x, y) => {
            let newValue;
            if (type === 2) {
                newValue = true;
            } else if (type === 3) {
                newValue = false;
            } else {
                newValue = !value;
            }

            map1.set(x, y, newValue);
        });

        map2.forSlice(x1, y1, x2 - x1 + 1, y2 - y1 + 1, (value, x, y) => {
            let newValue = value;
            if (type === 2) {
                newValue++;
            } else if (type === 3) {
                newValue--;
                if (newValue < 0) {
                    newValue = 0;
                }
            } else {
                newValue += 2;
            }

            map2.set(x, y, newValue);
        });
    });

    part1 = 0;
    map1.forEach(value => {
        if (value) {
            part1++;
        }
    });

    part2 = 0;
    map2.forEach(value => {
        part2 += value;
    });



    return [part1, part2];
}

const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));
