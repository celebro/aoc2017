const fs = require('fs');
const Grid = require('./grid');
const Queue = require('./queue');

const input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInput = `
###########
#0.1.....2#
#.#######.#
#4.......3#
###########
`.trim();

function run(input) {
    let part1 = 0;
    let part2 = 0;

    const grid = new Grid();
    const locations = [];
    input
        .split('\n')
        .filter(line => line.length)
        .forEach((line, row) => {
            line.split('').forEach((char, col) => {
                grid.set(col, row, {
                    wall: char === '#',
                    num: isNaN(char) ? null : +char,
                    row,
                    col
                });
                if (!isNaN(char)) {
                    locations[char] = { row, col };
                };
            })
        });

    // console.log(locations);
    // grid.print(node => {
    //     if (node.wall) {
    //         return '#';
    //     }
    //     return '.';
    // });


    // Dysktra from each point to each other point, store results in 'costs'
    const costs = new Grid();
    locations.forEach((loc, ix) => {
        const queue = new Queue();
        const data = new Grid();
        data.set(loc.col, loc.row, 0);
        queue.enq(grid.get(loc.col, loc.row));

        while (queue.size() > 0) {
            const node = queue.deq();
            const { col, row } = node;
            const steps = data.get(col, row);

            if (node.num !== null) {
                costs.set(ix, node.num, steps);
            }

            [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
                const neighbour = grid.get(col + dx, row + dy);
                if (neighbour && !neighbour.wall && data.get(col + dx, row + dy) === undefined) {
                    data.set(col + dx, row + dy, steps + 1);
                    queue.enq(neighbour);
                }
            })
        }
    });

    costs.print(a => a, 4);


    // Solve traveling salesman, small enough to brute force
    const selected = new Array(locations.length).fill(false);
    selected[0] = 1;
    part1 = Infinity;
    part2 = Infinity;

    function f(previous, sum) {
        let isLast = true;

        for (let i = 0; i < selected.length; i++) {
            if (!selected[i]) {
                isLast = false;
                selected[i] = true;
                const delta = costs.get(previous, i);
                f(i, sum + delta);
                selected[i] = false;
            }
        }

        if (isLast) {
            if (sum < part1) {
                part1 = sum;
            }
            const d2 = costs.get(previous, 0);
            if (sum + d2 < part2) {
                part2 = sum + d2;
            }
        }
    }

    f(0, 0);

    return [part1, part2];
}

const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));
