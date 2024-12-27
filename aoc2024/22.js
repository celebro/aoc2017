const fs = require('fs');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
1
2
3
2024
`
].map((x) => x.trim());

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = 0;
    let lines = readInput(input);

    let data = [];
    let possibleDiffs = new Set();
    for (let lineIx = 0; lineIx < lines.length; lineIx++) {
        let line = lines[lineIx];
        let n = parseInt(line);

        let sequence = [
            {
                num: n,
                price: n % 10,
                diff: 0
            }
        ];
        for (let i = 0; i < 2000; i++) {
            n = evolve(n);
            let price = n % 10;
            let diff = price - sequence[sequence.length - 1].price;
            possibleDiffs.add(diff);
            sequence.push({
                num: n,
                price,
                diff
            });
        }

        data.push(sequence);
        part1 += n;
    }

    let bananasBySequence = {};
    for (let monkey of data) {
        let seen = new Set();
        for (let i = 4; i < monkey.length; i++) {
            let sequence = monkey.slice(i - 3, i + 1).map((x) => x.diff);
            let key = sequence.join('');
            if (!seen.has(key)) {
                seen.add(key);
                if (!bananasBySequence[key]) {
                    bananasBySequence[key] = 0;
                }
                bananasBySequence[key] += monkey[i].price;
            }
        }
    }

    part2 = Math.max(...Object.values(bananasBySequence));

    return [part1, part2];
}

function getBananas(data, sequence) {
    let total = 0;
    for (let monkey of data) {
        let bananas = 0;

        for (let i = 4; i < monkey.length; i++) {
            if (
                sequence[0] === monkey[i - 3].diff &&
                sequence[1] === monkey[i - 2].diff &&
                sequence[2] === monkey[i - 1].diff &&
                sequence[3] === monkey[i - 0].diff
            ) {
                bananas = monkey[i].price;
                break;
            }
        }

        total += bananas;
    }
    return total;
}

function evolve(num) {
    let num1 = prune(mix(num, prune(num * 64)));
    let num2 = prune(mix(num1, Math.trunc(num1 / 32)));
    let num3 = prune(mix(num2, prune(num2 * 2048)));
    return num3;
}

function mix(secret, a) {
    return a ^ secret;
}

function prune(secret) {
    return secret % 16777216;
}
/**
 * @param {string} input
 */
function readInput(input) {
    let lines = input.split('\n');
    let startIx = 0;
    let endIx = lines.length;
    while (lines[startIx] === '\n' || lines[startIx] === '') {
        startIx++;
    }
    while (lines[endIx - 1] === '\n' || lines[endIx - 1] === '') {
        endIx--;
    }
    return lines.slice(startIx, endIx);
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
