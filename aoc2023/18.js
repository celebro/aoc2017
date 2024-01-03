const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)
`
].map((x) => x.trim());

const neighbours = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
];

const dirmap = {
    R: [1, 0],
    0: [1, 0],
    L: [-1, 0],
    2: [-1, 0],
    D: [0, 1],
    1: [0, 1],
    U: [0, -1],
    3: [0, -1]
};

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = undefined;
    const lines = input.split('\n').filter((line) => line.length);

    {
        const verticals = [];
        let x = 0;
        let y = 0;
        lines.forEach((line) => {
            const [dir, dist] = sscanf(line, '%s %d');
            const [dx, dy] = dirmap[dir];

            if (dy) {
                const newy = y + dy * dist;
                verticals.push(dy === 1 ? [x, y, newy] : [x, newy, y]);
            }
            x += dx * dist;
            y += dy * dist;
        });

        part1 = fillCount(verticals);
    }

    {
        const verticals = [];
        let x = 0;
        let y = 0;
        lines.forEach((line) => {
            let [dir, count, color] = sscanf(line, '%s %d (#%s)');
            color = color.substring(0, 6);

            const dist = parseInt(color.substring(0, 5), 16);
            const [dx, dy] = dirmap[color.at(5)];
            if (dy) {
                const newy = y + dy * dist;
                verticals.push(dy === 1 ? [x, y, newy] : [x, newy, y]);
            }
            x += dx * dist;
            y += dy * dist;
        });

        part2 = fillCount(verticals);
    }

    return [part1, part2];
}

function fillCount(verticals) {
    verticals.sort((a, b) => a[0] - b[0]);

    const rows = [...new Set([...verticals.map((p) => p[1]), ...verticals.map((p) => p[2])])];
    rows.sort((a, b) => a - b);

    const rectangles = [];
    for (let i = 0; i < rows.length; i++) {
        if (i > 0) {
            const height = rows[i] - rows[i - 1] - 1;
            if (height) {
                rectangles.push([rows[i] - 1, height]);
            }
        }
        rectangles.push([rows[i], 1]);
    }

    let count = 0;
    for (const [row, height] of rectangles) {
        let isIn = false;
        let isOnLine = false;
        let x = -Infinity;
        let rowCount = 0;

        for (const vert of verticals) {
            if (vert[0] > x && vert[1] <= row && row <= vert[2]) {
                rowCount += 1; // we hit a trench

                if (isOnLine || isIn) {
                    rowCount += vert[0] - x - 1;
                }

                if (vert[1] < row) {
                    isIn = !isIn;
                }
                if (row === vert[1] || row === vert[2]) {
                    isOnLine = !isOnLine;
                }

                x = vert[0];
            }
        }
        count += rowCount * height;
    }

    return count;
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
