const fs = require('fs');
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');
const Computer = require('./computer');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}

const WALL = 0;
const EMPTY = 1;
const TARGET = 2;

const NORTH = 1;
const SOUTH = 2;
const WEST = 3;
const EAST = 4;

const directions = {
    [NORTH]: [0, 1, NORTH],
    [WEST]: [-1, 0, WEST],
    [SOUTH]: [0, -1, SOUTH],
    [EAST]: [1, 0, EAST]
};

function getTarget(grid, startX, startY, isTarget) {
    const visited = new Grid((x, y) => ({ x, y, cost: -1, from: null, fromDirection: null }));
    const list = new List();

    const start = visited.get(startX, startY);
    start.cost = 0;
    list.push(start);

    let target = null;
    let maxCost = 0;

    while (target === null && !list.isEmpty()) {
        const current = list.shift();
        if (grid.get(current.x, current.y) === WALL) {
            continue;
        }

        for (const [dx, dy, direction] of Object.values(directions)) {
            const next = visited.get(current.x + dx, current.y + dy);
            if (next.cost === -1) {
                next.from = current;
                next.fromDirection = direction;
                maxCost = next.cost = current.cost + 1;

                if (isTarget(next.x, next.y)) {
                    target = next;
                    break;
                } else {
                    list.push(next);
                }
            }
        }
    }

    return { target, maxCost };
}

function getNextMove(grid, startX, startY, isTarget) {
    let { target } = getTarget(grid, startX, startY, isTarget);

    if (target) {
        while (target.from.from !== null) {
            target = target.from;
        }
        return target.fromDirection;
    }

    return null;
}

function print(grid, x, y) {
    grid.print2((value, x1, y1) => {
        if (x1 === x && y1 === y) {
            if (value === TARGET) {
                return '▣';
            }
            return '▢';
        } else if (value === undefined) {
            return ' ';
        } else if (value === WALL) {
            return '█';
        } else if (value === EMPTY) {
            if (x1 === 0 && y1 === 0) {
                return '※';
            }
            return '.';
        } else if (value === TARGET) {
            return '◉';
        }
    });
}

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;

    const code = input.split('\n').filter(line => line.length)[0];
    const computer = new Computer(code);

    const grid = new Grid();

    grid.set(0, 0, EMPTY);

    let x = 0;
    let y = 0;

    function isUnexplored(x, y) {
        return grid.get(x, y) === undefined;
    }

    let target = null;
    while (true) {
        const nextMove = getNextMove(grid, x, y, isUnexplored);
        if (!nextMove) {
            break;
        }
        const [dx, dy] = directions[nextMove];

        computer.addInput(nextMove);
        const [output] = computer.run();
        grid.set(x + dx, y + dy, output);

        if (output !== WALL) {
            x = x + dx;
            y = y + dy;

            if (output === TARGET) {
                target = { x, y };
                print(grid, x, y);
            }
        }
    }

    print(grid, x, y);

    part1 = getTarget(grid, target.x, target.y, (x, y) => x === y && y === 0).target.cost;
    part2 = getTarget(grid, target.x, target.y, () => false).maxCost;

    return [part1, part2];
}

const result = run(input);
console.log('result: ', result.join(' / '));
