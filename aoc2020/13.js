const { timeEnd } = require('console');
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
939
7,13,x,x,59,x,31,19
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

    const list = [];
    const timestamp = +lines[0];

    lines[1].split(',').forEach((bus, i) => {
        if (bus !== 'x') {
            list.push({ id: +bus, offset: i % +bus });
        }
    });

    let time1 = timestamp;
    while (!part1) {
        for (const { id: bus } of list) {
            const div = time1 / bus;
            if (div === ~~div) {
                part1 = bus * (time1 - timestamp);
                break;
            }
        }

        time1++;
    }

    let add = list[0].id;
    let time = 0;
    let i = 1;
    while (!part2) {
        time += add;
        const bus = list[i];
        if ((time + bus.offset) % bus.id === 0) {
            add = add * bus.id;
            i++;
            if (i === list.length) {
                break;
            }
        }
    }
    part2 = time;

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
