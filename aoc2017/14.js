console.time('time');

const knotHash = require('./util/knotHash');
const leftPad = require('./util/leftPad');

const input = 'uugsqrei';
const testInput = 'flqrgnkx';

function run(input) {
    let part1 = 0;
    let part2;

    const grid = [];
    for (let i = 0; i < 128; i++) {
        const hash = knotHash(`${input}-${i}`);
        const row = hash
            .split('')
            .map(char => parseInt(char, 16).toString(2))
            .map(string => leftPad(string, 4, '0'))
            .join('');

        grid[i] = row.split('').map(Number);
        part1 += grid[i].filter(ch => ch === 1).length;
    }

    let regions = 0;
    function mark(x, y) {
        if (x >= 0 && y >= 0 && x < 128 && y < 128) {
            if (grid[x][y] === 1) {
                grid[x][y] = 0;
                mark(x + 1, y);
                mark(x, y + 1);
                mark(x - 1, y);
                mark(x, y - 1);
                return true;
            }
        }
        return false;
    }

    for (let x = 0; x < 128; x++) {
        for (let y = 0; y < 128; y++) {
            if (mark(x, y)) {
                regions++
            }
        }
    }

    part2 = regions;

    return [part1, part2];
}

const testResult = run(testInput);
const result = run(input);

console.timeEnd('time');

console.log('test: ', testResult.join(' / '));
console.log('result: ', result.join(' / '));
