const fs = require('fs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576
`
].map((x) => x.trim());

/**
 * @param {string} input
 */
function run(input, preamble) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter((line) => line.length);

    const numbers = [];

    lines.forEach((line, ix) => {
        numbers.push(+line);
    });

    console.time('p1');
    for (let i = preamble; i < numbers.length; i++) {
        const num = numbers[i];
        let ok = false;

        loop: for (let j = i - preamble; j < i - 1; j++) {
            for (let k = j + 1; k < i; k++) {
                if (numbers[j] + numbers[k] === num) {
                    ok = true;
                    break loop;
                }
            }
        }

        if (!ok && part1 === undefined) {
            part1 = num;
        }
    }
    console.timeEnd('p1');

    ///////////
    console.time('p2');
    l1: for (let i = 0; i < numbers.length - 1; i++) {
        let sum = numbers[i];
        let min = numbers[i];
        let max = numbers[i];
        for (let j = i + 1; i < numbers.length; j++) {
            sum += numbers[j];
            if (sum > part1) {
                break;
            }
            min = Math.min(min, numbers[j]);
            max = Math.max(max, numbers[j]);
            if (sum === part1) {
                part2 = min + max;
                break l1;
            }
        }
    }
    console.timeEnd('p2');

    return [part1, part2];
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput, 5);
        console.log('test: ', testResult.join(' / '));
    }
}

for (let i = 0; i < 1000; i++) {
    const result = run(input, 25);
    console.log('result: ', result.join(' / '));
}
