const fs = require('fs');
const Grid = require('../utils/FixedGrid');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
....#
#..#.
#..##
..#..
#....
`
].map(x => x.trim());

const neighbours = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;

    const grid = new Grid(5, 5, 0);
    function makeGrid() {
        return new Grid(5, 5, () => ({ bug: 0, count: 0 }));
    }
    const initialGrid = makeGrid();

    const lines = input.split('\n').filter(line => line.length);
    lines.forEach((line, y) => {
        line.split('').forEach((char, x) => {
            let val = char === '#' ? 1 : 0;
            grid.set(x, y, val);
            initialGrid.get(x, y).bug = val;
        });
    });

    const visited = new Set();

    // grid.print(x => (x ? '#' : '.'));
    while (part1 === undefined) {
        const key = grid.grid.join('');
        if (visited.has(key)) {
            part1 = grid.grid.reduce((acc, val, i) => acc + (val === 1 ? 2 ** i : 0));
        }
        visited.add(key);

        const count = new Grid(5, 5, 0);
        grid.forEach((val, x, y) => {
            let bugs = 0;
            for (const [dx, dy] of neighbours) {
                if (grid.get(x + dx, y + dy, true) === 1) {
                    bugs++;
                }
            }
            count.set(x, y, bugs);
        });

        grid.forEach((val, x, y) => {
            const bugs = count.get(x, y);
            if (val === 1 && bugs !== 1) {
                grid.set(x, y, 0);
            } else if (val === 0 && (bugs === 1 || bugs === 2)) {
                grid.set(x, y, 1);
            }
        });
    }

    /** @type {Grid[]} */
    const levels = {};
    levels[0] = initialGrid;
    let minLevel = 0;
    let maxLevel = 0;

    // initialGrid.print(x => (x.bug ? '#' : '.'));

    for (let i = 0; i < 200; i++) {
        for (let j = minLevel; j <= maxLevel; j++) {
            const level = levels[j];
            level.forEach((v, x, y) => {
                if (v.bug === 0 || (x === 2 && y === 2)) return;

                for (const [dx, dy] of neighbours) {
                    const neighbour = level.get(x + dx, y + dy);
                    if (x + dx === 2 && y + dy === 2) {
                        // level + 1
                        if (j === maxLevel) {
                            levels[++maxLevel] = makeGrid();
                        }
                        let otherLevel = levels[j + 1];
                        for (let k = 0; k < 5; k++) {
                            let v = null;
                            if (dx !== 0) {
                                v = otherLevel.get(x - dx, k);
                            } else {
                                v = otherLevel.get(k, y - dy);
                            }
                            v.count += 1;
                        }
                    } else if (neighbour === undefined) {
                        // level - 1
                        if (j === minLevel) {
                            levels[--minLevel] = makeGrid();
                        }
                        let otherLevel = levels[j - 1];
                        let v = otherLevel.get(2 + dx, 2 + dy);
                        v.count += 1;
                    } else {
                        // same level
                        neighbour.count += 1;
                    }
                }
            });
        }

        part2 = 0;
        for (let j = minLevel; j <= maxLevel; j++) {
            const level = levels[j];
            // level.print(x => (x.count ? x.count : '.'));
            level.forEach(v => {
                if (v.bug === 1 && v.count !== 1) {
                    v.bug = 0;
                } else if (v.bug === 0 && (v.count === 1 || v.count === 2)) {
                    v.bug = 1;
                }
                if (v.bug) {
                    part2++;
                }
                v.count = 0;
            });
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
