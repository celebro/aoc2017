const fs = require('fs');
const Grid = require('../utils/Grid');
const Computer = require('./computer');
const rotate = require('../utils/rotate').rotate2;

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = undefined;

    const code = input.split('\n').filter(line => line.length)[0];

    let strOutput = Computer.runWithInputFull(code).map(x => String.fromCharCode(x));

    let x = 0;
    let y = 0;
    let start = { x: 0, y: 0 };
    const grid = new Grid();
    for (let char of strOutput) {
        if (char === '#' || char === '^') {
            grid.set(x, y, '#');
            if (char === '^') {
                start.x = x;
                start.y = y;
            }
        }
        if (char === '\n') {
            x = 0;
            y = y + 1;
        } else {
            x = x + 1;
        }
    }

    grid.forEach((value, x, y) => {
        if (value === '#' && grid.get(x - 1, y) + grid.get(x + 1, y) + grid.get(x, y + 1) + grid.get(x, y - 1) === '####') {
            part1 += x * y;
        }
    });

    grid.print(
        value => {
            if (value === '#') {
                return '█';
            } else {
                return '.';
            }
        },
        1,
        '.'
    );

    // part2
    x = start.x;
    y = start.y;
    let pos = start;
    let dir = { x: 0, y: -1 };

    /**
     *
     * @param {'left'|'right'} direction
     */
    function tryTurn(direction) {
        let nextDir = rotate({ ...dir }, direction);
        const value = grid.get(pos.x + nextDir.x, pos.y + nextDir.y);
        if (value === '#') {
            dir = nextDir;
            let steps = 0;
            while (grid.get(pos.x + dir.x, pos.y + dir.y) === '#') {
                pos.x += dir.x;
                pos.y += dir.y;
                steps++;
            }
            path.push(direction.charAt(0).toUpperCase() + ',' + steps);
            return steps;
        }
        return null;
    }

    /**
     * @type {string[]}
     */
    let path = [];
    while (tryTurn('left') || tryTurn('right')) {}
    console.log(path.join(','));

    /**
     *
     * @param {any[]} array
     * @param {number} startA
     * @param {number} startB
     * @param {number} length
     * @returns {boolean}
     */
    function subCompare(array, startA, startB, length) {
        for (let i = 0; i < length; i++) {
            if (array[startA + i] !== array[startB + i]) {
                return false;
            }
        }
        return true;
    }

    const datas = [
        { name: 'A', start: 0, end: 0, str: '' },
        { name: 'B', start: 0, end: 0, str: '' },
        { name: 'C', start: 0, end: 0, str: '' }
    ];

    let mainRoutine = [];
    function select(level, pos) {
        // debugger;
        const data = datas[level];
        data.start = pos;
        let length = 0;
        mainRoutine.push(data.name);
        for (let i = pos; i < path.length; i++) {
            length = length + path[i].length;
            data.end = i;
            if (length + i - pos /* commas */ > 20) {
                break;
            }

            // Repeat already selected
            let pointer = i;
            let changed = true;
            let mainRoutineLength = mainRoutine.length;
            while (changed) {
                changed = false;
                for (let j = 0; j <= level; j++) {
                    const data = datas[j];
                    const len = data.end - data.start + 1;
                    if (subCompare(path, data.start, pointer + 1, len)) {
                        mainRoutine.push(data.name);
                        pointer = pointer + len;
                        changed = true;
                    }
                }
            }

            if (pointer + 1 >= path.length) {
                return true;
            }

            if (level !== 2) {
                let done = select(level + 1, pointer + 1);
                if (done) return true;
            }
            mainRoutine.length = mainRoutineLength;
        }
        mainRoutine.pop();
    }
    select(0, 0);

    const computer = new Computer(code);
    computer.mem[0] = 2;
    function addInput(array) {
        const str = array.join(',') + '\n';
        console.log(str);
        const ascii = str.split('').map(char => char.charCodeAt(0));
        computer.addInput(...ascii);
    }
    addInput(mainRoutine);
    datas.forEach(data => {
        addInput(path.slice(data.start, data.end + 1));
    });
    addInput(['n']);

    const output = computer.run();
    part2 = output[output.length - 1];

    return [part1, part2];
}

const result = run(input);
console.log('result: ', result.join(' / '));
