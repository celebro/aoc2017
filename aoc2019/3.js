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
const testInput = `
R8,U5,L5,D3
U7,R6,D4,L4
`.trim();

const dirMap = {
    R: { dx: 1, dy: 0 },
    L: { dx: -1, dy: 0 },
    U: { dx: 0, dy: 1 },
    D: { dx: 0, dy: -1 }
};

function manhattan(x, y) {
    return Math.abs(x) + Math.abs(y);
}

/**
 *
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;

    const lines = input.split('\n').filter(line => line.length);
    const grid = new Grid(() => ({
        value: undefined,
        steps: [0, 0]
    }));
    let closestDistanceToIntersection = Infinity;
    let minNumberOfSteps = Infinity;

    lines.forEach((line, ix) => {
        const commands = line.split(',');
        let x = 0;
        let y = 0;
        let steps = 0;
        for (const command of commands) {
            const dir = command.substring(0, 1);
            const { dx, dy } = dirMap[dir];

            for (let length = Number(command.substring(1)); length > 0; length--) {
                x = x + dx;
                y = y + dy;
                steps = steps + 1;
                const node = grid.get(x, y);
                if (node.value === undefined) {
                    node.value = ix;
                    node.steps[ix] = steps;
                } else if (node.value === ix) {
                    //
                } else {
                    node.value = 'X';
                    node.steps[ix] = steps;

                    if (manhattan(x, y) < closestDistanceToIntersection) {
                        closestDistanceToIntersection = manhattan(x, y);
                    }
                    const sumSteps = node.steps[0] + node.steps[1];
                    if (sumSteps < minNumberOfSteps) {
                        minNumberOfSteps = sumSteps;
                    }
                }
            }
        }
    });

    function print(value) {
        if (value === undefined) {
            return '.';
        } else if (value === 0) {
            return '+';
        } else if (value === 1) {
            return '*';
        } else {
            return value;
        }
    }

    // grid.print2(print, 1, '.');

    part1 = closestDistanceToIntersection;
    part2 = minNumberOfSteps;

    return [part1, part2];
}

const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));
