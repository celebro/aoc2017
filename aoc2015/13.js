const fs = require('fs');
const sscanf = require('scan.js').scan;

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
Alice would gain 54 happiness units by sitting next to Bob.
Alice would lose 79 happiness units by sitting next to Carol.
Alice would lose 2 happiness units by sitting next to David.
Bob would gain 83 happiness units by sitting next to Alice.
Bob would lose 7 happiness units by sitting next to Carol.
Bob would lose 63 happiness units by sitting next to David.
Carol would lose 62 happiness units by sitting next to Alice.
Carol would gain 60 happiness units by sitting next to Bob.
Carol would gain 55 happiness units by sitting next to David.
David would gain 46 happiness units by sitting next to Alice.
David would lose 7 happiness units by sitting next to Bob.
David would gain 41 happiness units by sitting next to Carol.
`
].map((x) => x.trim());

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter((line) => line.length);

    const map = new Map();
    const people = new Set();

    lines.forEach((line) => {
        let [a, gainLoss, value, b] = sscanf(line.replace('.', ''), '%s would %s %d happiness units by sitting next to %s.');
        if (gainLoss === 'lose') {
            value = -value;
        }
        map.set(a + b, value);
        people.add(a);
    });

    const list = [...people.values()];

    function swap(a, b) {
        const tmp = list[b];
        list[b] = list[a];
        list[a] = tmp;
    }

    let best = -Infinity;

    function getGain(a, b) {
        const g1 = map.get(a + b) || 0;
        const g2 = map.get(b + a) || 0;
        return g1 + g2;
    }

    function r(pos, gain) {
        if (pos === list.length) {
            const a = list[pos - 1];
            const b = list[0];
            const delta = getGain(a, b);

            const total = gain + delta;
            if (total > best) {
                best = total;
            }
        } else {
            for (let i = pos; i < list.length; i++) {
                swap(pos, i);
                const a = list[pos];
                const b = list[pos - 1];
                const delta = getGain(a, b);
                r(pos + 1, gain + delta);
            }
        }
    }

    r(1, 0);
    part1 = best;

    list.push('me');
    best = -Infinity;
    r(1, 0);
    part2 = best;

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
