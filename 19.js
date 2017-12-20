const fs = require('fs');

const input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8');
const testInput = `
     |
     |  +--+
     A  |  C
 F---|----E|--+
     |  |  |  D
     +B-+  +--+
`;

function is(char) {
    return char !== undefined && char !== ' ';
}

function run(input) {
    let part1 = 0;
    let part2 = 0;

    const grid = input.split('\n').filter(line => line.length).map((line, ix) => {
        return line.split('');
    });

    let x = 0;
    let y = grid[0].indexOf('|');
    let dx = 1;
    let dy = 0;

    let done = false;;
    const str = [];

    while (!done) {
        const char = grid[x][y];
        if (!is(char)) {
            break;
        }
        part2++;

        if (char.match(/\w/)) {
            str.push(char);
        } else if (char === '+') {
            if (dx) {
                dx = 0;
                if (is(grid[x][y + 1])) {
                    dy = 1;
                } else if (is(grid[x][y - 1])) {
                    dy = -1;
                }
            } else if (dy) {
                dy = 0;
                if (grid[x + 1] && is(grid[x + 1][y])) {
                    dx = 1;
                } else if (grid[x - 1] && is(grid[x - 1][y])) {
                    dx = -1;
                }
            }
        }

        x += dx;
        y += dy;

        if (dx === 0 && dy === 0) {
            done = true;
        }
    }

    part1 = str.join('');

    return [part1, part2];
}

const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));
