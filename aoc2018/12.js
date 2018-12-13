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

    let initialState;
    let rules = new Map();
    let map = new Grid();
    lines.forEach((line, ix) => {
        if (ix === 0) {
            initialState = line.substring(15);
            initialState.split('').forEach((char, ix) => {
                map.set(ix, 0, char);
            })
        }
        if (ix > 0) {
            let split = line.split(' => ');

            rules.set(split[0], split[1]);
        }
    });

    map.print(x => x);
    let lastMap;

    let hits = new Map();
    let lastSum = 0;

    for (let gen = 0; gen < 1000; gen++) {
        lastMap = map;
        map = new Grid();
        for (let i = lastMap.minCol - 5; i <= lastMap.maxCol + 5; i++) {

            let str = [];
            for (let j = i - 2; j <= i + 2; j++) {
                str.push(lastMap.get(j, 0) || '.');
            }
            const tmp = str.join('');
            // if (i === 15) {
            //     debugger;
            // }
            let rule = rules.get(tmp);
            if (rule === '#') {
                map.set(i, 0, '#');
            } else if (lastMap.get(i, 0) === '#') {
                // debugger;
                map.set(i, 0, '.');
            } else if (lastMap.get(i, 0)) {
                map.set(i, 0, lastMap.get(i, 0));
            }
        }

        // map.print(x => x);
        // debugger;
        let sum = 0;
        for (let i = lastMap.minCol - 5; i <= lastMap.maxCol + 5; i++) {
            if (map.get(i, 0) === '#') {
                sum += i;
            }
        }
        lastSum = sum;
    }
    part2 = lastSum + (50000000000 - 1000) * 194;
    // 50000000000
    // let sum = 0;
    // for (let i = lastMap.minCol - 5; i <= lastMap.maxCol + 5; i++) {
    //     if (map.get(i, 0) === '#') {
    //         sum += i;
    //     }
    // }
    // part1 = sum;

    return [part1, part2];
}

// const testResult = run(testInput);
// console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));
