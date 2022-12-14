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
R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20
`
].map((x) => x.trim());

const neighbours = {
    R: [1, 0],
    L: [-1, 0],
    U: [0, 1],
    D: [0, -1]
};

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = 0;
    const lines = input.split('\n').filter((line) => line.length);

    part1 = solve(2, lines);
    part2 = solve(10, lines);

    return [part1, part2];
}

function solve(n, lines) {
    const rope = [];
    for (let i = 0; i < n; i++) {
        rope.push({ x: 0, y: 0 });
    }

    const grid = new Grid();
    grid.set(0, 0, true);

    for (const line of lines) {
        const [dir, steps] = sscanf(line, '%s %d');
        const diff = neighbours[dir];

        for (let i = 0; i < steps; i++) {
            rope[0].x += diff[0];
            rope[0].y += diff[1];

            for (let i = 1; i < rope.length; i++) {
                const head = rope[i - 1];
                const tail = rope[i];

                const dx = Math.abs(head.x - tail.x);
                const dy = Math.abs(head.y - tail.y);

                if (dx > 1) {
                    tail.x = (head.x + tail.x) / 2;
                } else if (dx > 0 && dy > 1) {
                    tail.x = head.x;
                }

                if (dy > 1) {
                    tail.y = (head.y + tail.y) / 2;
                } else if (dy > 0 && dx > 1) {
                    tail.y = head.y;
                }
            }

            const tail = rope.at(-1);
            grid.set(tail.x, tail.y, true);
        }
    }

    // function p() {
    //     grid.print2((v, col, row) => {
    //         if (v === true) {
    //             return '#';
    //         }
    //         return '.';
    //     });
    // }
    // p();

    let visited = 0;
    grid.forEach((v) => {
        if (v === true) {
            visited++;
        }
    });
    return visited;
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));

// 1790 too low
