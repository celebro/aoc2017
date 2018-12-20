const fs = require('fs');
const Grid = require('../utils/Grid');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch(e) {}
const testInput = `
.#.#...|#.
.....#|##|
.|..|...#.
..|#.....#
#.#|||#|#|
...#.||...
.|....|...
||...#|.#|
|.||||..|.
...#.|..|.
`
.trim();


function sum(map) {
    let count = { '.': 0, '|': 0, '#': 0 };
    map.forEach(char => {
        count[char]++;
    });

    return count['|'] * count['#'];
}

function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter(line => line.length);

    let map = new Grid();
    lines.forEach((line, y) => {
        line.split('').forEach((char, x) => {
            map.set(x, y, char);
        });
    });


    const hashMap = new Map();
    const iterations = [];


    let i = 1;
    while (part2 === undefined) {
        let update = new Grid();
        let hash = [];

        map.forEach((char, x, y) => {
            let count = { '.': 0, '|': 0, '#': 0 };
            map.forSlice(x - 1, y - 1, 3, 3, (n, xx, yy) => {
                if (xx !== x || yy != y) {
                    count[n]++;
                }
            });

            let nextChar;
            if (char === '.' && count['|'] >= 3) {
                nextChar = '|';
            } else if (char === '|' && count['#'] >= 3) {
                nextChar = '#';
            } else if (char === '#') {
                if (count['#'] >= 1 && count['|'] >= 1) {
                    nextChar = '#';
                } else {
                    nextChar = '.';
                }
            } else {
                nextChar = char;
            }
            update.set(x, y, nextChar);

            hash.push(nextChar);
        });

        iterations.push(update);
        map = update;
        if (i === 10) {
            part1 = sum(map);
        }

        let hashKey = hash.join('');
        if (hashMap.has(hashKey)) {
            const last = hashMap.get(hashKey);
            const diff = i - last;
            const remaining = 1000000000 - i;
            const mod = remaining % diff;
            const targetIteration = mod + last;
            part2 = sum(iterations[targetIteration - 1]);
        } else {
            hashMap.set(hashKey, i)
        }

        i++;
    }

    return [part1, part2];
}

const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));
