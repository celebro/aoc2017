const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#
`
].map((x) => x.trim());

const neighbours = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [0, 0]
];

const dir = {
    '<': [-1, 0],
    '>': [1, 0],
    v: [0, 1],
    '^': [0, -1]
};

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter((line) => line.length);

    let grid = new Grid();
    let time = 0;

    lines.forEach((line, iy) => {
        line.split('').forEach((char, ix) => {
            let value;
            if (char === '#') {
                value = null;
            } else if (char === '.') {
                value = [];
            } else {
                value = [char];
            }
            grid.set(ix, iy, value);
        });
    });

    // grid.set(start.x, start.y, 'S');
    // grid.set(end.x, end.y, 'E');

    function gridStep() {
        time = time + 1;
        const next = new Grid();
        grid.forEach((v, x, y) => {
            if (v) {
                next.set(x, y, []);
            } else {
                next.set(x, y, null);
            }
        });
        const reset = {
            '<': (x, y) => [lines[0].length - 2, y],
            '>': (x, y) => [1, y],
            v: (x, y) => [x, 1],
            '^': (x, y) => [x, lines.length - 2]
        };
        grid.forEach((v, x, y) => {
            for (const wind of v || []) {
                const delta = dir[wind];
                let nx = x + delta[0];
                let ny = y + delta[1];
                if (!next.get(nx, ny)) {
                    [nx, ny] = reset[wind](x, y);
                }
                next.get(nx, ny).push(wind);
            }
        });
        grid = next;
    }

    // print();

    // for (let i = 1; i < 18; i++) {
    //     console.log(i);
    //     gridStep();
    //     print();
    // }

    function print() {
        grid.print(
            (v) => {
                if (v === null) {
                    return '#';
                } else if (v.length === 0) {
                    return '.';
                } else if (v.length === 1) {
                    return v[0];
                } else {
                    return v.length;
                }
            },
            1,
            '#'
        );
    }

    let list = new List();
    let start = { x: 1, y: 0, time: 0 };
    let end = { x: lines[0].length - 2, y: lines.length - 1 };
    let target = end;

    list.enq(start);
    let visited = {};

    let stage = 1;

    while (!list.isEmpty()) {
        const n = list.deq();

        if (n.x === target.x && n.y === target.y) {
            if (stage === 1) {
                part1 = n.time;

                list = new List();
                target = start;
                visited = {};
                stage++;
            } else if (stage === 2) {
                list = new List();
                target = end;
                visited = {};
                stage++;
            } else {
                part2 = n.time;
                break;
            }
        }

        if (n.time >= time) {
            gridStep();
        }

        for (const [dx, dy] of neighbours) {
            let nx = n.x + dx;
            let ny = n.y + dy;
            if (grid.get(nx, ny)?.length === 0) {
                let k = `${nx}=${ny}=${n.time + 1}`;
                if (!visited[k]) {
                    visited[k] = true;
                    list.enq({ x: nx, y: ny, time: n.time + 1 });
                }
            }
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
