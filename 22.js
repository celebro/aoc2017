const fs = require('fs');

console.time('time');

const input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInput = `
..#
#..
...
`.trim();


function run(input) {
    let part1 = 0;
    let part2 = 0;

    const lines = input
        .split('\n')
        .filter(line => line.length);

    function part(part) {
        const map = new Map();

        function get(x, y) {
            const t = map.get(y);
            return t && t.get(x) || 0;
        }

        function set(x, y, value) {
            let t = map.get(y);
            if (t === undefined) {
                t = new Map();
                map.set(y, t);
            }
            t.set(x, value);
        }

        let x = 0;
        let y = 0;

        lines.forEach((line, _y) => {
            y = -_y;
            line.split('').forEach((char, _x) => {
                x = _x;
                if (char === '#') {
                    set(x, y, 2);
                }
            });
        });

        const iterations = part === 1 ? 10000 : 10000000;
        x = x / 2;
        y = y / 2;
        let dx = 0;
        let dy = 1;
        let count = 0;
        const step = part === 1 ? 2 : 1;

        for (let i = 0; i < iterations; i++) {
            const state = get(x, y);

            switch (state) {
                case 0: // clean, left
                    if (dy) {
                        dx = -dy;
                        dy = 0;
                    } else {
                        dy = dx;
                        dx = 0;
                    }
                    break;
                case 1: // weak
                    break;
                case 2: // infected, right
                    if (dy) {
                        dx = dy;
                        dy = 0;
                    } else {
                        dy = -dx;
                        dx = 0;
                    }
                    break;
                case 3: // flagged, reverse
                    dx = -dx;
                    dy = -dy;
                    break;
            }


            let newState = (state + step) % 4;
            if (newState === 2) {
                count++;
            }
            set(x, y, newState);

            x += dx;
            y += dy;
        }

        return count;
    }

    part1 = part(1);
    part2 = part(2);

    return [part1, part2];
}

const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));

console.timeEnd('time');
