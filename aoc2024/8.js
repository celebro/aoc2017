const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    let lines = readInput(input);

    let grid = new Grid();
    let map = {};

    for (let x = 0; x < lines.length; x++) {
        let line = lines[x];
        for (let y = 0; y < line.length; y++) {
            let char = line[y];

            if (char !== '.') {
                if (char in map) {
                    map[char].push({ x, y });
                } else {
                    map[char] = [{ x, y }];
                }
            }

            grid.set(x, y, { x, y });
        }
    }

    let uniq = new Set();
    let uniq2 = new Set();

    for (let freq in map) {
        let pos = map[freq];
        for (let i = 0; i < pos.length - 1; i++) {
            for (let j = i + 1; j < pos.length; j++) {
                let dx = pos[j].x - pos[i].x;
                let dy = pos[j].y - pos[i].y;

                let p1 = grid.get(pos[i].x - dx, pos[i].y - dy);
                if (p1) {
                    uniq.add(p1);
                }
                let p2 = grid.get(pos[j].x + dx, pos[j].y + dy);
                if (p2) {
                    uniq.add(p2);
                }

                let p = grid.get(pos[i].x, pos[i].y);
                while (p) {
                    uniq2.add(p);
                    p = grid.get(p.x - dx, p.y - dy);
                }

                p = grid.get(pos[j].x, pos[j].y);
                while (p) {
                    uniq2.add(p);
                    p = grid.get(p.x + dx, p.y + dy);
                }
            }
        }
    }

    part1 = uniq.size;
    part2 = uniq2.size;

    return [part1, part2];
}

/**
 * @param {string} input
 */
function readInput(input) {
    let lines = input.split('\n');
    let startIx = 0;
    let endIx = lines.length;
    while (lines[startIx] === '\n' || lines[startIx] === '') {
        startIx++;
    }
    while (lines[endIx - 1] === '\n' || lines[endIx - 1] === '') {
        endIx--;
    }
    return lines.slice(startIx, endIx);
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
