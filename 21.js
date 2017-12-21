const fs = require('fs');

const input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInput = `
../.# => ##./#../...
.#./..#/### => #..#/..../..../#..#
`.trim();

const start = `.#./..#/###`;

function toGrid(line) {
    const grid = line.split('/').map(l => l.split(''));
    return grid;
}

function toKey(grid) {
    const key = grid.map(l => l.join('')).join('');
    return key;
}

function log(grid) {
    let str = grid.map(a => a.join('')).join('\n');
    console.log(str);
    console.log('');
}

function count(grid) {
    let count = 0;
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid.length; x++) {
            if (grid[y][x] === '#') {
                count++;
            }
        }
    }

    return count;
}

function run(input, test) {
    let part1 = 0;
    let part2 = 0;

    const rules = new Map();
    input
        .split('\n')
        .filter(line => line.length)
        .map((line, ix) => {
            let [inp, out] = line.split(' => ');
            const outGrid = toGrid(out);
            let p = toGrid(inp);

            for (let i = 0; i < 4; i++) {
                // Flip h
                let p2 = [];
                for (let a = 0; a < p.length; a++) {
                    p2[a] = [];
                    for (let b = 0; b < p.length; b++) {
                        p2[a].push(p[p.length - 1 - a][b]);
                    }
                }
                let key = toKey(p2);
                rules.set(key, { grid: outGrid, ix, i, t:'h' });

                // Flip v
                p2 = [];
                for (let a = 0; a < p.length; a++) {
                    p2[a] = [];
                    for (let b = 0; b < p.length; b++) {
                        p2[a].push(p[a][p.length - 1 - b]);
                    }
                }
                key = toKey(p2);
                rules.set(key, { grid: outGrid, ix, i, t: 'v' });

                // Rotate
                p2 = [];
                for (let a = 0; a < p.length; a++) {
                    p2[a] = [];
                    for (let b = 0; b < p.length; b++) {
                        p2[a].push(p[b][p.length - 1 - a]);
                    }
                }
                key = toKey(p2);
                rules.set(key, { grid: outGrid, ix, i, t: 'r' });

                p = p2;
            }
        });

    function iterate(iter) {
        let grid = toGrid(start);

        for (let i = 0; i < iter; i++) {
            let div;
            if (grid.length % 2 === 0) {
                div = 2;
            } else {
                div = 3;
            }

            const newGrid = [];
            let ga = 0, gb = 0;

            for (let y = 0; y < grid.length; y += div) {
                for (let x = 0; x < grid.length; x+= div) {
                    let key = [];
                    for (let a = 0; a < div; a++) {
                        for (let b = 0; b < div; b++) {
                            const c = grid[y + a][x + b]
                            key.push(c);
                        }
                    }
                    const rule = rules.get(key.join(''));
                    const sub = rule.grid;

                    for (let a = 0; a < sub.length; a++) {
                        for (let b = 0; b < sub.length; b++) {
                            newGrid[ga + a] = newGrid[ga + a] || [];
                            newGrid[ga + a][gb + b] = sub[a][b];
                        }
                    }
                    gb += div + 1;
                    // log(newGrid);
                }
                gb = 0;
                ga += div + 1;
            }

            grid = newGrid;
        }

        return count(grid);
    }

    part1 = iterate(test ? 2 : 5);
    if (!test) {
        part2 = iterate(18);
    }

    return [part1, part2];
}

const testResult = run(testInput, true);
console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));

// > 145
// < 210
