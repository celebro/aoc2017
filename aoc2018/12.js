const fs = require('fs');
const sscanf = require('scan.js').scan;
// @ts-ignore
const Grid = require('../utils/Grid');
// @ts-ignore
const List = require('../utils/LinkedList');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch(e) {}
const testInput = `
initial state: #..#.#..##......###...###

...## => #
..#.. => #
.#... => #
.#.#. => #
.#.## => #
.##.. => #
.#### => #
#.#.# => #
#.### => #
##.#. => #
##.## => #
###.. => #
###.# => #
####. => #
`
.trim();


function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter(line => line.length);

    let rules = new Map();
    let map = new Grid();
    lines.forEach((line, ix) => {
        if (ix === 0) {
            let initialState = line.substring(15);
            initialState.split('').forEach((char, ix) => {
                map.set(ix, 0, char === '#');
            })
        } else {
            let split = line.split(' => ');
            let ruleKey = 0;
            for (const char of split[0]) {
                ruleKey = (ruleKey << 1) + (char === '#' ? 1 : 0);
            }
            rules.set(ruleKey, split[1] === '#');
        }
    });

    // map.print(x => x ? '#' : '.');

    let gen = 0;
    let lastSum = 0;
    let lastDiff = 0;
    let lastDiffRepeats = 0;

    while(lastDiffRepeats < 5) {
        gen++;

        let sum = 0;
        let ruleKey = 0;
        for (let i = map.minCol - 2; i <= map.maxCol + 2; i++) {
            ruleKey = ruleKey & 15;
            ruleKey = ruleKey << 1;
            ruleKey = ruleKey + (map.get(i + 2, 0) ? 1 : 0);

            let rule = rules.get(ruleKey);
            if (rule) {
                map.set(i, 0, true);
                sum += i;
            } else if (map.get(i, 0)) {
                map.set(i, 0, false);
            }
        }

        if (gen === 20) {
            part1 = sum;
        }

        if (sum - lastSum === lastDiff) {
            lastDiffRepeats += 1;
        } else {
            lastDiffRepeats = 0;
        }
        lastDiff = sum - lastSum;
        lastSum = sum;
    }
    console.log(lastDiff);
    part2 = lastSum + (50000000000 - gen) * lastDiff;

    return [part1, part2];
}

const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

console.time('time');
const result = run(input);
console.timeEnd('time');
console.log('result: ', result.join(' / '));
