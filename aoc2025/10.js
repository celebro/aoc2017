const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');
const Queue = require('priorityqueuejs');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = 0;
    let lines = readInput(input);

    // let target = [];
    // let buttons = [];

    for (let lineIx = 0; lineIx < lines.length; lineIx++) {
        let line = lines[lineIx];
        let parts = line.split(' ');

        let target = parts[0]
            .slice(1, -1)
            .split('')
            .map((x) => (x === '#' ? true : false));
        let buttons = parts.slice(1, -1).map((x) =>
            x
                .slice(1, -1)
                .split(',')
                .map((y) => parseInt(y))
        );
        let jolt = parts
            .at(-1)
            .slice(1, -1)
            .split(',')
            .map((x) => parseInt(x));

        part1 += count(target, buttons);
        let p2 = count2(jolt, buttons);
        part2 += p2;

        console.log(parts[0], parts.at(-1), '=>', p2);
    }

    function count(target, buttons) {
        let q = new Queue((a, b) => b.steps - a.steps);
        q.enq({
            steps: 0,
            pos: 0,
            lights: Array(target.length).fill(false),
            trace: []
        });

        while (q.size() > 0) {
            let curr = q.deq();

            // press and check if done
            let nextLights = [...curr.lights];
            for (let ix of buttons[curr.pos]) {
                nextLights[ix] = !nextLights[ix];
            }
            if (nextLights.every((x, ix) => x === target[ix])) {
                return curr.steps + 1;
            }

            if (curr.pos < buttons.length - 1) {
                // not pressing
                q.enq({ ...curr, pos: curr.pos + 1 });

                // pressing
                q.enq({
                    steps: curr.steps + 1,
                    pos: curr.pos + 1,
                    lights: nextLights,
                    trace: [...curr.trace, '(' + buttons[curr.pos].join(',') + ')']
                });
            }
        }

        throw new Error('DNF');
    }

    function count2(target, buttons) {
        if (target.every((x) => x === 0)) {
            return 0;
        }

        let combos = findCombos(target, buttons);

        let options = combos.map((combo) => {
            let nextTarget = combo.remaining.map((x) => x / 2);
            let pressed = combo.pressed + 2 * count2(nextTarget, buttons);
            return pressed;
        });

        return Math.min(...options);
    }

    function findCombos(target, buttons) {
        let combos = [];

        let sum = Array(target.length).fill(0);
        function rec(buttonIx, pressed) {
            if (buttonIx === buttons.length) {
                let ok = sum.every((x, ix) => {
                    let t = target[ix];
                    if (x > t) return false;
                    return (t - x) % 2 === 0;
                });

                if (ok) {
                    combos.push({
                        pressed: pressed,
                        remaining: target.map((x, ix) => x - sum[ix])
                    });
                }
                return;
            }

            let button = buttons[buttonIx];

            // not pressing
            rec(buttonIx + 1, pressed);

            // pressing
            for (let ix of button) sum[ix]++;
            rec(buttonIx + 1, pressed + 1);
            for (let ix of button) sum[ix]--;
        }
        rec(0, 0);

        return combos;
    }

    return [part1, part2];
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
