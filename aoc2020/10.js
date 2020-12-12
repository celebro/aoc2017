const fs = require('fs');
const sscanf = require('scan.js').scan;
// @ts-ignore
const Grid = require('../utils/Grid');
// @ts-ignore
const List = require('../utils/LinkedList');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
16
10
15
5
1
11
7
19
6
12
4
`,
    `
28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3
`
].map((x) => x.trim());

const { performance } = require('perf_hooks');
let lastName;
let lastValue;
function mark(name) {
    const value = performance.now();
    if (lastValue) {
        console.log(lastName, value - lastValue);
    }
    lastValue = performance.now();
    lastName = name;
}

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter((line) => line.length);

    const jolts = [];
    lines.forEach((line, ix) => {
        jolts.push(+line);
    });

    mark('sort');
    jolts.push(0);
    jolts.sort((a, b) => a - b);
    jolts.push(jolts[jolts.length - 1] + 3);
    console.log(JSON.stringify(jolts, null, 2));
    const deltas = [0, 0, 0, 0];

    mark('part1');
    for (let i = 0; i < jolts.length; i++) {
        deltas[jolts[i] - jolts[i - 1]]++;
    }

    part1 = deltas[1] * deltas[3];

    mark('part2');
    const map = new Map();

    function r(i, last) {
        const key = i * 1000 + last;
        let sum = 0;
        if (jolts[i] - last > 3) {
            // noop
        } else if (map.has(key)) {
            sum = map.get(key);
        } else if (i === jolts.length - 1) {
            sum = 1;
        } else {
            sum += r(i + 1, last) + r(i + 1, jolts[i]);
            map.set(key, sum);
        }

        return sum;
    }

    part2 = r(1, 0);
    mark();

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
