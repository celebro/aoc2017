const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');
const md5 = require('md5');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = 0;
    const lines = input.split('\n');
    lines.push('');

    let map = new Grid();
    let y = 0;
    lines.forEach((line) => {
        line.split('').forEach((char, ix) => {
            map.set(ix, y, char);
        });
        y++;

        if (line === '') {
            solve();
            map = new Grid();
            y = 0;
        }
    });

    function solve() {
        const map1 = map;
        const map2 = new Grid();

        map1.forEach((char, col, row) => {
            map2.set(row, map1.maxCol - col, char);
        });

        const r1 = findMirror(map1);
        const r2 = findMirror(map2);

        part1 += r1[0] + 100 * r2[0];
        part2 += r1[1] + 100 * r2[1];
    }

    return [part1, part2];
}

/**
 *
 * @param {Grid} data
 * @returns
 */
function findMirror(data) {
    const mirrors = {};

    for (let i = 0; i <= data.maxCol - 1; i++) {
        const edgeDistance = Math.min(i, data.maxCol - 1 - i);
        let diffCount = 0;
        for (let diff = 0; diff <= edgeDistance; diff++) {
            for (let j = 0; j <= data.maxRow; j++) {
                if (data.get(i - diff, j) !== data.get(i + 1 + diff, j)) {
                    diffCount++;
                }
            }
        }

        mirrors[diffCount] = i + 1;
    }

    return [mirrors[0] || 0, mirrors[1] || 0];
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
