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
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter(line => line.length);

    const map = new Grid(() => ({
        clay: false,
        wet: false,
        still: false
    }));
    map.minRow = 0;

    function print() {
        map.print((x, col, row) => {
            if (col === 500 && row === 0) {
                return '+';
            } else if (x.clay) {
                return '#'
            } else if (x.still) {
                return '~';
            } else if (x.wet) {
                return '|';
            } else {
                return '.';
            }
        });
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

    print();

    function fillLine(x, y) {
        map.get(x, y).still = true;
        let px = x;
        while (!map.get(px + 1, y).clay) {
            map.get(px + 1, y).still = true;
            px++;
        }
        px = x;
        while (!map.get(px - 1, y).clay) {
            map.get(px - 1, y).still = true;
            px--;
        }
    }

    part1 = 0;

    function stream(x, y) {
        while (y < map.maxRow && !map.get(x, y + 1).clay) {
            if (!map.get(x, y + 1).wet) {
                map.get(x, y + 1).wet = true;
                part1++;
            }
            y++;
        }
        if (y === map.maxRow) {
            return;
        }


        while (true) {
            let contained = 0;

            function side(dir) {
                let px = x;
                let py = y;
                while (true) {
                    const loc = map.get(px + dir, py);
                    if (loc.clay) {
                        contained++;
                        break;
                    } else {
                        if (!loc.wet) {
                            loc.wet = true;
                            part1++;
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

            side(1);
            side(-1);

            if (contained === 2) {
                fillLine(x, y);
                y--;
            }

            // print();
            // debugger;

            if (contained !== 2) {
                break;
            }
        }

        print();
    }

    stream(500, 0);








    return [part1, part2];
}

const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));

// !27044
