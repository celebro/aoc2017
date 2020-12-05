const { time } = require('console');
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
Comet can fly 14 km/s for 10 seconds, but then must rest for 127 seconds.
Dancer can fly 16 km/s for 11 seconds, but then must rest for 162 seconds.
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input, time) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter((line) => line.length);

    const deerList = [];

    lines.forEach((line, ix) => {
        const [name, speed, fly, rest] = sscanf(line, '%s can fly %d km/s for %d seconds, but then must rest for %d seconds.');
        deerList.push({ name, speed, fly, rest, mode: 'fly', from: 0, distance: 0, points: 0 });
    });

    for (let i = 0; i < time; i++) {
        for (const deer of deerList) {
            const deltaTime = i - deer.from;
            if (deer.mode === 'fly') {
                if (deltaTime < deer.fly) {
                    deer.distance += deer.speed;
                } else {
                    deer.mode = 'rest';
                    deer.from = i;
                }
            } else {
                if (deltaTime < deer.rest) {
                    // noop
                } else {
                    deer.mode = 'fly';
                    deer.from = i;
                    deer.distance += deer.speed;
                }
            }
        }
        const leadDistance = Math.max(...deerList.map((deer) => deer.distance));
        for (const deer of deerList) {
            if (deer.distance === leadDistance) {
                deer.points++;
            }
        }
    }

    part1 = Math.max(...deerList.map((deer) => deer.distance));

    part2 = Math.max(...deerList.map((deer) => deer.points));

    return [part1, part2];
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput, 1000);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input, 2503);
console.log('result: ', result.join(' / '));
