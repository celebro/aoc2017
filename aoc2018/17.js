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

    function print() {
        const minRow = map.minRow;
        map.minRow = 0; // For printing;
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

    const minRow = map.minRow;

    // print();


    function side(dir, x, y) {
        let px = x;
        let py = y;
        while (true) {
            const loc = map.get(px + dir, py);
            if (loc.clay) {
                return 1;
            } else {
                if (!loc.wet) {
                    loc.wet = true;
                    if (py >= minRow) {
                        part1++;
                    }
                } else {
                    // print();
                    // debugger;
                }
                const down = map.get(px + dir, py + 1);
                if (!down.clay && !down.still) {
                    stream(px + dir, py);
                    if (!down.still) {
                        break;
                    }
                }
            }
            px = px + dir;
        }
    }

    function stream(x, y) {
        while (y < map.maxRow) {
            const loc = map.get(x, y + 1);
            if (loc.clay || loc.still) {
                break;
            }

            if (!loc.wet) {
                loc.wet = true;
                if (y + 1 >= minRow) {
                    part1++;
                }
            } else {
                return;
            }

            y++;
        }

        if (y === map.maxRow) {
            return;
        }


        while (true) {
            let contained = 0;
            if (side(1, x, y)) {
                contained++;
            }
            if (side(-1, x, y)) {
                contained++;
            }

            if (contained === 2) {
                part2 += fillLine(map, x, y);
                y--;
            } else {
                break;
            }
        }
    }

    stream(500, 0);

    // print();

    return [part1, part2];
}

function fillLine(map, x, y) {
    let count = 0;

    if (!map.get(x, y).still) {
        map.get(x, y).still = true;
        count++;
    }

    let px = x;
    while (!map.get(px + 1, y).clay) {
        const loc = map.get(px + 1, y);
        if (!loc.still) {
            loc.still = true;
            count++;
        }
        px++;
    }
    px = x;
    while (!map.get(px - 1, y).clay) {
        const loc = map.get(px - 1, y)
        if (!loc.still) {
            loc.still = true;
            count++;
        }
        px--;
    }

    return count;
}

const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

console.time('time');
const result = run(input);
console.timeEnd('time');
console.log('result: ', result.join(' / '));
