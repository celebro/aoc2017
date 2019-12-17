const fs = require('fs');
const rotate = require('../utils/rotate').rotate;
const Computer = require('./computer');
const Grid = require('../utils/Grid');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const code = input.split('\n').filter(line => line.length)[0];

    function paint(grid) {
        const vm = new Computer(code);
        const pos = { x: 0, y: 0 };
        const dir = { x: 0, y: 1 };

        while (!vm.isHalted) {
            vm.addInput(grid.get(pos.x, pos.y) || 0);
            const [color, rot] = vm.run();
            grid.set(pos.x, pos.y, color);
            rotate(dir, rot === 0 ? 'left' : 'right');
            pos.x += dir.x;
            pos.y += dir.y;
        }
    }

    let grid = new Grid();
    paint(grid);
    let count = 0;
    grid.forEach(value => {
        if (value !== undefined) {
            count++;
        }
    });
    part1 = count;

    // part 2
    grid = new Grid();
    grid.set(0, 0, 1);
    paint(grid);
    grid.print2(x => (x === 0 ? ' ' : '█')); // HJALJZFH

    return [part1, part2];
}

const result = run(input);
console.log('result: ', result.join(' / '));
