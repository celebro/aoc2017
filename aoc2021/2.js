const fs = require('fs');
const sscanf = require('scan.js').scan;

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7
`
].map((x) => x.trim());

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter((line) => line.length);

    let position = 0;
    let depth = 0;

    lines.forEach((line) => {
        const [dir, num] = sscanf(line, '%s %d');
        switch (dir) {
            case 'forward':
                position += num;
                break;
            case 'backward':
                position -= num;
                break;
            case 'down':
                depth += num;
                break;
            case 'up':
                depth -= num;
                break;
            default:
                throw new Error('invalid dir');
        }
    });

    part1 = position * depth;

    position = 0;
    depth = 0;
    let aim = 0;

    lines.forEach((line) => {
        const [dir, num] = sscanf(line, '%s %d');
        switch (dir) {
            case 'forward':
                position += num;
                depth += aim * num;
                break;
            case 'down':
                aim += num;
                break;
            case 'up':
                aim -= num;
                break;
            default:
                throw new Error('invalid dir');
        }
    });
    part2 = position * depth;

    return [part1, part2];
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
