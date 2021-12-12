const fs = require('fs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
16,1,2,0,4,2,7,1,2,14
`
].map((x) => x.trim());

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const crabs = input
        .split('\n')
        .filter((line) => line.length)[0]
        .split(',')
        .map((x) => +x);

    const min = Math.min(...crabs);
    const max = Math.max(...crabs);

    for (let p = min; p <= max; p++) {
        let fuel = 0;
        for (const crab of crabs) {
            fuel += Math.abs(crab - p);
        }

        if (part1 === undefined || fuel < part1) {
            part1 = fuel;
        }
    }

    for (let p = min; p <= max; p++) {
        let fuel = 0;
        for (const crab of crabs) {
            const distance = Math.abs(crab - p);
            fuel += distance * (distance + 1) * 0.5;
        }

        if (part2 === undefined || fuel < part2) {
            part2 = fuel;
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
