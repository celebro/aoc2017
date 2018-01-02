const fs = require('fs');

const input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();

function run(input) {
    let part1 = 0;
    let part2 = 0;

    let x = 0;
    let y = 0;
    let dx = 0;
    let dy = 1;
    const set = new Set();

    input
        .split('\n')
        .filter(line => line.length)[0]
        .split(', ')
        .forEach(code => {
            const dir = code.charAt(0);
            let len = +code.slice(1);
            if (dir === 'L') {
                if (dy) {
                    dx = -dy;
                    dy = 0;
                } else {
                    dy = dx;
                    dx = 0;
                }
            } else {
                if (dy) {
                    dx = dy;
                    dy = 0;
                } else {
                    dy = -dx;
                    dx = 0;
                }
            }

            while (len > 0) {
                len--;
                x += dx;
                y += dy;

                if (!part2 && set.has(x + ' ' + y)) {
                    part2 = Math.abs(x) + Math.abs(y)
                }
                set.add(x + ' ' + y);
            }
        });

    part1 = Math.abs(x) + Math.abs(y);

    return [part1, part2];
}

console.log('test: ', run('R2, L3').join(' / '));
console.log('test: ', run('R2, R2, R2').join(' / '));
console.log('test: ', run('R5, L5, R5, R3').join(' / '));
console.log('test: ', run('R8, R4, R4, R8').join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));
// < 316
