const fs = require('fs');
const { rotate } = require('../utils/rotate');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
F10
N3
F7
R90
F11
`
].map((x) => x.trim());

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter((line) => line.length);

    const instructions = [];
    lines.forEach((line, ix) => {
        const cmd = line[0];
        const value = +line.substr(1);
        instructions.push({ cmd, value });
    });

    let x = 0;
    let y = 0;
    let dx = 1;
    let dy = 0;

    for (const { cmd, value } of instructions) {
        if (cmd === 'N') {
            y += value;
        } else if (cmd === 'S') {
            y -= value;
        } else if (cmd === 'E') {
            x += value;
        } else if (cmd === 'W') {
            x -= value;
        } else if (cmd === 'F') {
            x += dx * value;
            y += dy * value;
        } else if (cmd === 'L') {
            for (let i = 0; i < value / 90; i++) {
                ({ x: dx, y: dy } = rotate({ x: dx, y: dy }, 'left'));
            }
        } else if (cmd === 'R') {
            for (let i = 0; i < value / 90; i++) {
                ({ x: dx, y: dy } = rotate({ x: dx, y: dy }, 'right'));
            }
        }
    }

    part1 = Math.abs(x) + Math.abs(y);

    ///////////////////
    x = 0;
    y = 0;
    dx = 10;
    dy = 1;

    for (const { cmd, value } of instructions) {
        if (cmd === 'N') {
            dy += value;
        } else if (cmd === 'S') {
            dy -= value;
        } else if (cmd === 'E') {
            dx += value;
        } else if (cmd === 'W') {
            dx -= value;
        } else if (cmd === 'F') {
            x += dx * value;
            y += dy * value;
        } else if (cmd === 'L') {
            for (let i = 0; i < value / 90; i++) {
                ({ x: dx, y: dy } = rotate({ x: dx, y: dy }, 'left'));
            }
        } else if (cmd === 'R') {
            for (let i = 0; i < value / 90; i++) {
                ({ x: dx, y: dy } = rotate({ x: dx, y: dy }, 'right'));
            }
        }
    }

    part2 = Math.abs(x) + Math.abs(y);

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

// 2674 too high
