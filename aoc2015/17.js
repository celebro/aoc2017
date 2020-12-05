const fs = require('fs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
20
15
10
5
5
`
].map((x) => x.trim());

/**
 * @param {string} input
 */
function run(input, max = 150) {
    let part1 = 0;
    let part2 = undefined;
    const lines = input.split('\n').filter((line) => line.length);

    let containers = [];
    lines.forEach((line) => {
        containers.push(+line);
    });

    containers.sort((a, b) => b - a);
    let map = new Map();

    function r(pos, sum, num) {
        let selectedSum = sum + containers[pos];
        if (selectedSum === max) {
            part1++;
            map.set(num, (map.get(num) || 0) + 1);
        }

        if (pos < containers.length - 1) {
            r(pos + 1, sum, num);
            if (selectedSum < max) {
                r(pos + 1, selectedSum, num + 1);
            }
        }
    }

    r(0, 0, 0);

    const minContainers = Math.min(...map.keys());
    part2 = map.get(minContainers);

    return [part1, part2];
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput, 25);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
