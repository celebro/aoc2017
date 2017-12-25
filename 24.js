console.time('time');

const fs = require('fs');

const input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInput = `
0/2
2/2
2/3
3/4
3/5
0/1
10/1
9/10
`.trim();

function run(input) {
    let part1 = 0;
    let part2 = 0;

    const lines = input
        .split('\n')
        .filter(line => line.length)
        .map(line => line.split('/').map(Number));


    function compatible(next, lastType) { // has side effects :(
        if (next[0] === lastType) {
            return next[1];
        } else if (next[1] === lastType) {
            return next[0];
        }
        return -1;
    }

    const taken = [];
    let maxl = 0;
    function go(lastType, strength, length) {
        if (strength > part1) {
            part1 = strength;
        }

        if (length > maxl) {
            maxl = length;
            part2 = 0;
        }
        if (length === maxl && strength > part2) {
            part2 = strength;
        }

        lines.forEach((el, ix) => {
            if (!taken[ix]) {
                let c = compatible(el, lastType);
                if (c !== -1) {
                    taken[ix] = true;
                    go(c, strength + el[0] + el[1], length + 1);
                    taken[ix] = false;
                }
            }
        });
    }

    go(0, 0, 0);

    return [part1, part2];
}

const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));

console.timeEnd('time');
