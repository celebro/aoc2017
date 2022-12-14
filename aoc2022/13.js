const fs = require('fs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]
`
].map((x) => x.trim());

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = 0;
    const lines = input.split('\n');

    let pairs = [];
    let pair;
    lines.forEach((line) => {
        if (line.length) {
            if (!pair) {
                pair = [];
                pairs.push(pair);
            }
            pair.push(eval(line));
        } else {
            pair = undefined;
        }
    });

    pairs.forEach(([a, b], index) => {
        if (compare(a, b) === -1) {
            part1 += index + 1;
        }
    });

    function compare(a, b) {
        for (let i = 0; i < Math.min(a.length, b.length); i++) {
            const left = a[i];
            const right = b[i];
            if (Array.isArray(left) || Array.isArray(right)) {
                const nexta = Array.isArray(left) ? left : [left];
                const nextb = Array.isArray(right) ? right : [right];
                const next = compare(nexta, nextb);
                if (next !== undefined) {
                    return next;
                }
            } else {
                if (left < right) {
                    return -1;
                } else if (left > right) {
                    return 1;
                }
            }
        }

        if (a.length < b.length) {
            return -1;
        } else if (a.length > b.length) {
            return 1;
        }

        return undefined;
    }

    const div1 = [[2]];
    const div2 = [[6]];

    const list = pairs.flat(1);
    list.push(div1, div2);
    list.sort(compare);

    // console.log(list.map((x) => JSON.stringify(x)));

    const ix1 = list.indexOf(div1) + 1;
    const ix2 = list.indexOf(div2) + 1;
    part2 = ix1 * ix2;

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
