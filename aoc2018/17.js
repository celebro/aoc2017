const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/FixedGrid');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch(e) {}
const testInput = `
x=495, y=2..7
y=7, x=495..501
x=501, y=3..7
x=498, y=2..4
x=506, y=1..2
x=498, y=10..13
x=504, y=10..13
y=13, x=498..504
`
.trim();


function run(input) {
    let part1 = 0;
    let part2 = 0;
    const lines = input.split('\n').filter(line => line.length);

    const map = new Grid(1000, 2100, () => ({
        clay: false,
        wet: false,
        still: false
    }));

    function print(y) {
        const minRow = map.minRow;
        map.minRow = 0; // For printing;
        const maxRow = map.maxRow;
        if (y) {
            map.maxRow = y;
        }
        map.print((x, col, row) => {
            if (x.still) {
                return '█';
            } else if (x.wet) {
                return '|';
            } else if (col === 500 && row === 0) {
                return '+';
            } else if (x.clay) {
                return '#'
            } else {
                return '.';
            }
        });
        map.minRow = minRow;
        if (y) {
            map.maxRow = maxRow;
        }
    }

    lines.forEach((line) => {
        const tmp1 = line.split(', ');

        const tmpa = tmp1[0].split('=');
        const coord1 = tmpa[0];
        const val1 = +tmpa[1];

        const tmpb = tmp1[1].split('=');
        const tmpb2 = tmpb[1].split('..');
        const val2a = +tmpb2[0];
        const val2b = +tmpb2[1];

        for (let val2i = val2a; val2i <= val2b; val2i++) {
            if (coord1 === 'x') {
                map.get(val1, val2i).clay = true;
            } else {
                map.get(val2i, val1).clay = true;
            }
        }
    });

    const firstInputLine = map.minRow;
    // print();


    function side(dir, x, y) {
        let px = x;
        let py = y;
        let contained = false;
        while (true) {
            px = px + dir;
            const loc = map.get(px, py);
            if (loc.clay) {
                contained = true;
                break;
            } else {
                loc.wet = true;
                part1++;

                const down = map.get(px, py + 1);
                if (!down.clay && !down.still) {
                    stream(px, py);
                    if (!down.still) {
                        break;
                    }
                }
            }
        }
        return contained;
    }

    function stream(xx, yy) {
        let x = xx;
        let y = yy;
        while (y < map.maxRow) {
            const loc = map.get(x, y + 1);
            if (loc.clay || loc.still) {
                // Will start spilling left / right
                break;
            }

            if (!loc.wet) {
                loc.wet = true;
                part1++;
            } else {
                // Spill already handled by another stream
                return;
            }

            y++;
        }

        if (y === map.maxRow) {
            return;
        }

        let contained = true;
        while (contained && y > yy) {
            contained = side(1, x, y);
            contained = side(-1, x, y) && contained;

            if (contained) {
                part2 += fillLine(map, x, y);
                y--;
            }
        }
    }

    stream(500, 0);

    part1 = part1 - firstInputLine + 1; // algo counts from line 1, but task requires count from top most input

    // print();

    return [part1, part2];
}

function fillLine(map, x, y) {
    map.get(x, y).still = true;
    const count = 1 + fillSide(map, x, y, 1) + fillSide(map, x, y, -1);
    return count;
}

function fillSide(map, x, y, dir) {
    let px = x;
    let count = 0;
    while (true) {
        px = px + dir;
        const loc = map.get(px, y);
        if (loc.clay) {
            break;
        }
        loc.still = true;
        count++;
    }
    return count;
}

const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

console.time('time');
const result = run(input);
console.timeEnd('time');
console.log('result: ', result.join(' / '));
