const fs = require('fs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = ['1', '11', '21', '1211', '111221'].map((x) => x.trim());

/**
 * @param {string} input
 */
function run(input, num = 50) {
    let part1 = undefined;
    let part2 = undefined;
    let str = input
        .split('\n')
        .filter((line) => line.length)[0]
        .split('');

    for (let iterate = 0; iterate < num; iterate++) {
        if (iterate === 40) {
            part1 = str.length;
        }

        let next = [];

        let char = str[0];
        let count = 0;

        for (let i = 0; i < str.length; i++) {
            if (str[i] === char) {
                count += 1;
            }
            if (str[i] !== char) {
                next.push(String(count), char);
                count = 1;
                char = str[i];
            }
            if (i === str.length - 1) {
                next.push(String(count), char);
            }
        }
        str = next.join('').split('');
        if (num === 1) {
            part1 = str.join('');
        }
    }

    part2 = str.length;

    return [part1, part2];
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput, 1);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
