const fs = require('fs');

const input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInput = `
ULL
RRDDD
LURDL
UUUUD
`.trim();

const keypad1 = `
123
456
789
`

const keypad2 = `
  1
 234
56789
 ABC
  D`;


function clamp(value, min, max) {
    if (value < min) {
        return min;
    } else if (value > max) {
        return max;
    }
    return value;
}

function run(input) {
    let part1 = 0;
    let part2 = 0;

    function go(keypad, x, y) {
        keypad = keypad.split('\n').filter(l => l.length > 0).map(l => l.split(''));

        let code = [];

        function valid(x, y) {
            const char = keypad[y] && keypad[y][x];
            return char !== undefined && char !== ' ';
        }

        input
            .split('\n')
            .filter(line => line.length)
            .forEach(line => {

                line.split('').forEach(dir => {
                    let _y = y;
                    let _x = x;
                    if (dir === 'U') {
                        _y--;
                    } else if (dir === 'D') {
                        _y++
                    } else if (dir === 'L') {
                        _x--;
                    } else if (dir === 'R') {
                        _x++;
                    }

                    if (valid(_x, _y)) {
                        x = _x;
                        y = _y;
                    }
                })

                const number = keypad[y][x];
                code.push(number);
            });

        return code.join('');
    }


    part1 = go(keypad1, 1, 1);
    part2 = go(keypad2, 0, 2);


    return [part1, part2];
}

const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));
