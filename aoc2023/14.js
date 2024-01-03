const fs = require('fs');
const Grid = require('../utils/Grid');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....
`
].map((x) => x.trim());

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = 0;
    const lines = input.split('\n').filter((line) => line.length);

    const map1 = new Grid();
    const map2 = new Grid();
    lines.forEach((line, y) => {
        line.split('').forEach((char, x) => {
            map1.set(x, y, char);
            map2.set(x, y, char);
        });
    });

    tilt(map1, (x, y) => [x, y]);
    part1 = load(map1);

    const cache = {
        [hash(map2)]: 0
    };
    const countCache = {
        0: load(map2)
    };

    let count = 0;
    while (true) {
        cycle(map2);
        count++;
        const h = hash(map2);
        if (cache[h] !== undefined) {
            const repeat = count - cache[h];
            const targetCount = ((1000000000 - count) % repeat) + cache[h];
            part2 = countCache[targetCount];
            break;
        } else {
            cache[h] = count;
            countCache[count] = load(map2);
        }
    }

    return [part1, part2];
}

/**
 * @param {Grid} map
 * @param {(x, y) => [x, y]} transform
 */
function tilt(map, transform) {
    for (let x = 0; x <= map.maxCol; x++) {
        let top = 0;
        for (let y = 0; y <= map.maxRow; y++) {
            const node = map.get(...transform(x, y));
            if (node === 'O') {
                map.set(...transform(x, y), '.');
                map.set(...transform(x, top), 'O');
                top++;
            } else if (node === '#') {
                top = y + 1;
            }
        }
    }
}

/**
 * @param {Grid} map
 */
function cycle(map) {
    let max = map.maxCol;
    tilt(map, (x, y) => [x, y]);
    tilt(map, (x, y) => [y, max - x]);
    tilt(map, (x, y) => [max - x, max - y]);
    tilt(map, (x, y) => [max - y, x]);
}

/**
 * @param {Grid} map
 */
function hash(map) {
    let h = '';
    map.forEach((char, x, y) => {
        if (char === 'O') {
            h += `${x},${y},`;
        }
    });
    return h;
}

function load(map) {
    let l = 0;
    map.forEach((char, x, y) => {
        if (char === 'O') {
            l += map.maxRow - y + 1;
        }
    });

    return l;
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
