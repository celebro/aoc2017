const fs = require('fs');
const Grid = require('../utils/Grid');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
7-F7-
.FJ|7
SJLL7
|F--J
LJ.LJ
`,
    `
...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........
`,
    `
FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L
`
].map((x) => x.trim());

const neighbours = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
];

/**
 * @type {Record<string, {from: [number, number], to: [number, number], right: [number, number][], left: [number, number][], turn?: 'left' | 'right'}>}
 */
const connected = {
    '|': {
        from: [0, 1],
        to: [0, -1],
        right: [[1, 0]],
        left: [[-1, 0]]
    },
    '-': {
        from: [-1, 0],
        to: [1, 0],
        right: [[0, 1]],
        left: [[0, -1]]
    },
    L: {
        from: [0, -1],
        to: [1, 0],
        turn: 'left',
        right: [
            [-1, 0],
            [0, 1]
        ],
        left: []
    },
    J: {
        from: [0, -1],
        to: [-1, 0],
        turn: 'right',
        right: [],
        left: [
            [1, 0],
            [0, 1]
        ]
    },
    7: {
        from: [0, 1],
        to: [-1, 0],
        turn: 'left',
        right: [
            [1, 0],
            [0, -1]
        ],
        left: []
    },
    F: {
        from: [0, 1],
        to: [1, 0],
        turn: 'right',
        right: [],
        left: [
            [-1, 0],
            [0, -1]
        ]
    }
};

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = 0;
    const lines = input.split('\n').filter((line) => line.length);

    /**
     * @typedef {{ char: string, steps?: number, x: number, y: number}} Node
     */

    /** @type {Node} */
    let start;
    const map = new Grid();
    lines.forEach((line, iy) => {
        line.split('').forEach((char, ix) => {
            const node = {
                x: ix,
                y: iy,
                char
            };
            map.set(ix, iy, node);
            if (char === 'S') {
                start = node;
            }
        });
    });

    start.steps = 0;
    /** @type {Node[]} */
    let path = [start];
    for (const [dx, dy] of neighbours) {
        const n = map.get(start.x + dx, start.y + dy);
        if (n) {
            const c = connected[n.char];
            if (c) {
                if ((c.from[0] === -dx && c.from[1] === -dy) || (c.to[0] === -dx && c.to[1] === -dy)) {
                    n.steps = 1;
                    path.push(n);
                    break;
                }
            }
        }
    }

    all: while (true) {
        const node = path.at(-1);
        const c = connected[node.char];

        for (const n of [c.from, c.to]) {
            const next = map.get(node.x + n[0], node.y + n[1]);
            if (next === path[0]) {
                break all;
            }
            if (next && next.steps === undefined) {
                next.steps = node.steps + 1;
                path.push(next);
                break;
            }
        }
    }

    part1 = (path.at(-1).steps + 1) / 2;

    const onPath = new Set(path);

    for (let y = 0; y <= map.maxRow; y++) {
        let out = true;
        let last = 0;
        for (let x = 0; x <= map.maxCol; x++) {
            const node = map.get(x, y);
            if (onPath.has(node)) {
                if (node.char === 'F') {
                    last = +1;
                } else if (node.char === 'L') {
                    last = -1;
                } else if (node.char === '7') {
                    if (last === -1) {
                        out = !out;
                    }
                } else if (node.char === 'J') {
                    if (last === 1) {
                        out = !out;
                    }
                } else if (node.char === '|') {
                    out = !out;
                }
            } else if (!out) {
                part2++;
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

// !33
