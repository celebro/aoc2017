const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = 0;
    const lines = input.split('\n').filter((line) => line.length);

    const groups = [];
    lines.forEach((line, ix) => {
        const half1 = line.slice(0, line.length / 2);
        const half2 = line.slice(line.length / 2);

        const items1 = new Set(half1.split(''));
        const common = half2.split('').find((item) => items1.has(item));
        part1 += getPriority(common);

        let last = groups.at(-1);
        if (!last || last.length === 3) {
            last = [];
            groups.push(last);
        }
        last.push(line.split(''));
    });

    for (const [a, b, c] of groups) {
        const common = a.filter((x) => b.includes(x) && c.includes(x));
        part2 += getPriority(common[0]);
    }

    return [part1, part2];
}

function getPriority(char) {
    let priority = 0;
    if (char === char.toUpperCase()) {
        priority = char.charCodeAt(0) - 'A'.charCodeAt(0) + 27;
    } else {
        priority = char.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
    }
    return priority;
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
