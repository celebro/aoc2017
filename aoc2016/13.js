const fs = require('fs');

const input = +fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInput = +`
10
`.trim();

const Grid = require('./grid');
const Queue = require('./queue');

function run(input, targetX, targetY) {
    let part1 = 0;
    let part2 = 0;

    const grid = new Grid();
    const queue = new Queue();
    queue.enq({ x: 1, y: 1, cost: 0 });

    function isWall(x, y) {
        const num = x * x + 3 * x + 2 * x * y + y + y * y + input;
        const bin = num.toString(2);
        const ones = bin.split('').filter(x => x === '1').length;
        return (ones & 1) === 1; // if odd
    }

    let count = 0;
    while (queue.size() > 0 && (part1 === 0 || part2 === 0)) {
        const { x, y, cost } = queue.deq();
        const loc = grid.get(x, y);

        if (loc !== undefined || x < 0 || y < 0) {
            // already visited or invalid
            continue;
        }
        if (isWall(x, y)) {
            grid.set(x, y, -1);
            continue;
        }

        grid.set(x, y, cost);

        if (x === targetX && y === targetY) {
            part1 = cost;
        }
        if (cost <= 50) {
            count++;
        } else if (cost === 51) {
            part2 = count;
        }

        queue.enq({ x: x + 1, y: y, cost: cost + 1});
        queue.enq({ x: x - 1, y: y, cost: cost + 1 });
        queue.enq({ x: x, y: y + 1, cost: cost + 1 });
        queue.enq({ x: x, y: y - 1, cost: cost + 1 });
    }

    return [part1, part2];
}

const testResult = run(testInput, 7, 4);
console.log('test: ', testResult.join(' / '));

const result = run(input, 31, 39);
console.log('result: ', result.join(' / '));
