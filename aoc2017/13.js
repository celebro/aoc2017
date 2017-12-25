console.time('mark');

const fs = require('fs');

const input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInput = `
0: 3
1: 2
4: 4
6: 4
`.trim();

function run(input) {
    let part1;
    let part2;

    const data = [];
    input.split('\n').forEach(line => {
        data.push(line.split(': ').map(Number));
    });

    data.sort((a, b) => a[1] - b[1]);

    function go(delay) {
        let cost = 0;
        for (let i = 0; i < data.length; i++) {
            const d = data[i];
            const depth = d[0];
            const range = d[1];

            if ((depth + delay) % (2 * range - 2) === 0) {
                if (delay !== 0) {
                    return -1;
                } else {
                    cost += range * depth;
                }
            }
        }

        return cost;
    }

    part1 = go(0);

    let delay = 0;
    while (go(delay) !== 0) {
        delay += 1;
    }
    part2 = delay;

    return [part1, part2];
}


const testResult = run(testInput);
const result = run(input);

console.timeEnd('mark');
console.log('test: ', testResult.join(' / '));
console.log('result: ', result.join(' / '));
