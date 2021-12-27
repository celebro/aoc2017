const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    //     `
    // ...>...
    // .......
    // ......>
    // v.....>
    // ......>
    // .......
    // ..vvv..
    // `
    `
v...>>.vv>
.vv>>.vv..
>>.>v>...v
>>v>>.>.v.
v>v.vv.v..
>.>>..v...
.vv..>.>v.
v.v..>>v.v
....v..v.>
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

    let map = new Grid();

    lines.forEach((line, y) => {
        line.split('').forEach((char, x) => {
            map.set(x, y, char);
        });
    });

    map.print((x) => x);

    for (let i = 1; ; i++) {
        let next = new Grid();
        let moves = 0;

        map.forEach((loc, x, y) => {
            if (!next.get(x, y)) {
                next.set(x, y, loc);
            }
            if (loc === '>') {
                const nextX = (x + 1) % (map.maxCol + 1);
                const nextLoc = map.get(nextX, y);
                if (nextLoc === '.') {
                    next.set(x, y, '.');
                    next.set(nextX, y, loc);
                    moves++;
                }
            }
        });
        map = next;
        // map.print((x) => x || '.');

        next = new Grid();
        map.forEach((loc, x, y) => {
            if (!next.get(x, y)) {
                next.set(x, y, loc);
            }
            if (loc === 'v') {
                const nextY = (y + 1) % (map.maxRow + 1);
                const nextLoc = map.get(x, nextY);
                if (nextLoc === '.') {
                    next.set(x, y, '.');
                    next.set(x, nextY, loc);
                    moves++;
                }
            }
        });

        map = next;

        // map.print((x) => x || '.');
        // debugger;

        if (moves === 0) {
            part1 = i;
            break;
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
