const fs = require('fs');
const Grid = require('../utils/Grid');
const Computer = require('./computer');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}

const EMPTY = 0;
const WALL = 1;
const BLOCK = 2;
const PADDLE = 3;
const BALL = 4;

const gridMap = {
    [EMPTY]: ' ',
    [WALL]: '█',
    [BLOCK]: '░',
    [PADDLE]: '┉',
    [BALL]: '▢'
};

const NEUTRAL = 0;
const LEFT = -1;
const RIGHT = 1;

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = undefined;

    const code = input.split('\n').filter(line => line.length)[0];
    const computer = new Computer(code);
    computer.mem[0] = 2;
    const grid = new Grid();

    function print() {
        grid.print((v, x, y) => {
            if (x === -1 && y === 0) {
                return v;
            }
            return gridMap[v];
        });
    }

    let ball = { x: 0, y: 0, dir: NEUTRAL };
    let paddle = { x: 0, y: 0 };

    while (!computer.isHalted) {
        const output = computer.run();

        for (let i = 0; i < output.length; i = i + 3) {
            const x = output[i];
            const y = output[i + 1];
            const id = output[i + 2];
            grid.set(x, y, id);

            if (id === BALL) {
                if (x > ball.x) {
                    ball.dir = RIGHT;
                } else if (x < ball.x) {
                    ball.dir = LEFT;
                }
                ball.x = x;
                ball.y = y;
            }
            if (id === PADDLE) {
                paddle.x = x;
                paddle.y = y;
            }
        }

        if (part1 === 0) {
            print();
            for (let i = 0; i < output.length; i = i + 3) {
                if (output[i + 2] === BLOCK) {
                    part1++;
                }
            }
        }

        let nextBallX = ball.x + ball.dir;
        let input = NEUTRAL;
        if (ball.y === paddle.y - 1 && ball.x === paddle.x) {
            input = NEUTRAL;
        } else if (paddle.x < nextBallX) {
            input = RIGHT;
        } else if (paddle.x > nextBallX) {
            input = LEFT;
        }
        computer.addInput(input);
    }

    part2 = grid.get(-1, 0);
    print();

    return [part1, part2];
}

const result = run(input);
console.log('result: ', result.join(' / '));
