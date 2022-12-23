const fs = require('fs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
1
2
-3
3
-2
0
4
`
].map((x) => x.trim());

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;

    const nums = input
        .split('\n')
        .filter((x) => x.length)
        .map((x) => +x);

    part1 = runPart(nums, 1);
    part2 = runPart(nums, 2);

    return [part1, part2];
}

function runPart(nums, part) {
    const map = {};
    const list = [];

    for (let i = 0; i < nums.length; i++) {
        const node = {
            v: nums[i],
            i: i
        };
        if (part === 2) {
            node.v *= 811589153;
        }
        map[i] = node;
        list.push(node);
    }

    for (let iter = 0; iter < (part === 1 ? 1 : 10); iter++) {
        for (const node of list) {
            let startI = node.i;
            let endI = node.v >= 0 ? inc(node.i, node.v, list.length) : dec(node.i, node.v, list.length);

            if (startI < endI) {
                for (let i = startI; i < endI; i++) {
                    map[i] = map[i + 1];
                    map[i].i--;
                }
            } else if (endI < startI) {
                for (let i = startI; i > endI; i--) {
                    map[i] = map[i - 1];
                    map[i].i++;
                }
            }
            map[endI] = node;
            node.i = endI;
        }
    }

    let ix = 0;
    for (const node of list) {
        if (node.v === 0) {
            ix = node.i;
        }
    }

    const values = [1000, 2000, 3000].map((n) => map[(ix + n) % list.length].v);
    return values.reduce((a, b) => a + b);
}

function inc(start, increase, length) {
    const steps = increase % (length - 1);
    if (start + steps < length) {
        return start + steps;
    } else {
        return start + steps - length + 1;
    }
}

function dec(start, dec, length) {
    const steps = -dec % (length - 1);
    if (start - steps > 0) {
        return start - steps;
    } else {
        return start - steps + length - 1;
    }
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
