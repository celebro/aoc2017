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
NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter((line) => line.length);

    const template = lines.shift().split('');
    const map = new Map();

    lines.forEach((line) => {
        const [from, to] = sscanf(line, '%s -> %s');
        map.set(from, to);
    });

    const cache = new Map();
    function f(a, b, level) {
        const key = `${a}_${b}_${level}`;
        if (key in cache) {
            return cache[key];
        }

        let r = {};
        if (level === 0) {
            r[a] = 1;
            r[b] = (r[b] || 0) + 1;
        } else {
            const c = map.get(a + b);
            merge(r, f(a, c, level - 1));
            merge(r, f(c, b, level - 1));
            r[c]--;
        }

        cache[key] = r;

        return r;
    }

    function merge(result, freq) {
        for (const [key, value] of Object.entries(freq)) {
            result[key] = (result[key] || 0) + value;
        }
    }

    function expandTemplate(level) {
        const freqs = {};
        for (let i = 1; i < template.length; i++) {
            merge(freqs, f(template[i - 1], template[i], level));
            if (i > 1) {
                freqs[template[i - 1]]--;
            }
        }

        const values = Object.values(freqs);
        values.sort((a, b) => b - a);
        return values[0] - values[values.length - 1];
    }
    console.time('p1');
    part1 = expandTemplate(10);
    console.timeEnd('p1');

    console.time('p2');
    part2 = expandTemplate(40);
    console.timeEnd('p2');

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
