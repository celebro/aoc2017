const fs = require('fs');
const sscanf = require('scan.js').scan;

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
e => H
e => O
H => HO
H => OH
O => HH

HOHOHO
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

    const map = new Map();
    const reverse = new Map();
    let medicine = '';
    lines.forEach((line, ix) => {
        if (ix === lines.length - 1) {
            medicine = line;
        } else {
            const [from, to] = sscanf(line, '%s => %s');
            let replacements = map.get(from) || [];
            replacements.push(to);
            map.set(from, replacements);
            reverse.set(to, from);
        }
    });

    const set = new Set();

    let i = 0;
    while (i < medicine.length) {
        let before = medicine.slice(0, i);

        let atom = medicine[i];
        i = i + 1;
        if (i < medicine.length && medicine[i].toLowerCase() === medicine[i]) {
            atom = atom + medicine[i];
            i = i + 1;
        }

        let after = medicine.slice(i);

        if (map.has(atom)) {
            for (const replace of map.get(atom)) {
                set.add(before + replace + after);
            }
        }
    }

    part1 = set.size;

    const reverseList = [...reverse.keys()].sort((a, b) => b.length - a.length);

    let change = false;
    let work = medicine;
    let count = 0;

    do {
        change = false;
        for (const r of reverseList) {
            if (work.indexOf(r) >= 0) {
                work = work.replace(r, reverse.get(r));
                count++;
                change = true;
                break;
            }
        }
    } while (change);

    part2 = count;

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
