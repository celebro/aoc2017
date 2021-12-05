const fs = require('fs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010
`
].map((x) => x.trim());

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter((line) => line.length);

    const ones = [];
    const zeros = [];
    for (const line of lines) {
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const array = char === '1' ? ones : zeros;
            array[i] = (array[i] || 0) + 1;
        }
    }

    for (let i = 0; i < ones.length; i++) {
        if (ones[i] > zeros[i]) {
            ones[i] = 1;
            zeros[i] = 0;
        } else {
            ones[i] = 0;
            zeros[i] = 1;
        }
    }

    const epsilon = parseInt(ones.join(''), 2);
    const gamma = parseInt(zeros.join(''), 2);

    part1 = epsilon * gamma;
    part2 = getRating(lines, true) * getRating(lines, false);

    return [part1, part2];
}

/**
 *
 * @param {string[]} lines
 * @param {boolean} oxygen
 */
function getRating(lines, oxygen) {
    let bit = 0;
    while (true) {
        let ones = [];
        let zeros = [];
        for (const line of lines) {
            if (line.charAt(bit) === '1') {
                ones.push(line);
            } else {
                zeros.push(line);
            }
        }

        if (oxygen) {
            lines = ones.length >= zeros.length ? ones : zeros;
        } else {
            lines = ones.length >= zeros.length ? zeros : ones;
        }

        if (lines.length === 1) {
            const rating = parseInt(lines[0], 2);
            return rating;
        }

        bit++;
    }
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
