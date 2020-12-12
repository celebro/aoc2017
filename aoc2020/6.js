const fs = require('fs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
abc

a
b
c

ab
ac

a
a
a
a

b
`
].map((x) => x.trim());

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = 0;
    const lines = input.split('\n');

    const groups = [];
    let group = null;

    lines.forEach((line) => {
        if (!group) {
            group = { size: 0, ans: {} };
            groups.push(group);
        }

        if (line.length === 0) {
            group = null;
        } else {
            group.size++;
            for (const char of line) {
                group.ans[char] = (group.ans[char] || 0) + 1;
            }
        }
    });

    for (const group of groups) {
        part1 += Object.values(group.ans).length;
        for (const count of Object.values(group.ans)) {
            if (count === group.size) {
                part2 += 1;
            }
        }
    }

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
