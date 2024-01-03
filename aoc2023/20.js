const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');
const Queue = require('../utils/ArrayQueue');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a
`,
    `
broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output
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

    /** @type {Record<string, { type: '' | '%' | '&', out: string[], mem: Record<string, number>, id: string }>} */
    const modules = {};

    lines.forEach((line, ix) => {
        let [id, out] = line.split(' -> ');
        let typeid = id.at(0);
        if (typeid === '%' || typeid === '&') {
            id = id.substring(1);
        } else {
            typeid = '';
        }
        modules[id] = {
            id: id,
            type: /** @type{'' | '%' |'&'} */ (typeid),
            out: out.split(', '),
            mem: {}
        };
    });

    // set initial memory
    let hasRx = false;
    for (const mod of Object.values(modules)) {
        if (mod.type === '%') {
            mod.mem.state = 0;
        }
        for (const out of mod.out) {
            const next = modules[out];
            if (next && next.type === '&') {
                next.mem[mod.id] = 0;
            } else if (out === 'rx') {
                hasRx = true;
            }
        }
    }

    let highCount = 0;
    let lowCount = 0;

    let count = 0;
    const part2Count = {};

    while (!part2) {
        count++;

        /** @type { Queue<{ sender: string, receiver: string, pulse: number }>} */
        const queue = new Queue();
        queue.enq({ sender: 'button', receiver: 'broadcaster', pulse: 0 });

        while (!queue.isEmpty() && !part2) {
            const op = queue.deq();
            // console.log(op);

            if (op.pulse === 0) {
                lowCount++;
            } else {
                highCount++;
            }

            const mod = modules[op.receiver];
            if (!mod) {
                continue;
            }

            if (op.receiver === 'df' && op.pulse === 1) {
                part2Count[op.sender] = part2Count[op.sender] || count;
                if (Object.values(part2Count).length === Object.values(mod.mem).length) {
                    part2 = Object.values(part2Count).reduce((a, b) => a * b, 1);
                }
            }

            /** @type {number|undefined} */
            let pulse;
            if (mod.type === '') {
                pulse = op.pulse;
            } else if (mod.type === '%') {
                if (op.pulse === 0) {
                    pulse = mod.mem.state = mod.mem.state ^ 1;
                }
            } else if (mod.type === '&') {
                mod.mem[op.sender] = op.pulse;
                pulse = Object.values(mod.mem).some((x) => x === 0) ? 1 : 0;
            }

            if (pulse !== undefined) {
                for (const receiver of mod.out) {
                    queue.enq({ sender: mod.id, receiver, pulse });
                }
            }
        }

        if (count === 1000) {
            part1 = lowCount * highCount;
            if (!hasRx) {
                break;
            }
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
