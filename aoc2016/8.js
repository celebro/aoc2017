const fs = require('fs');

const input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInput = `
rect 3x2
rotate column x=1 by 1
rotate row y=0 by 4
rotate column x=1 by 1
`.trim();

function show(screen) {
    screen.forEach(row => {
        console.log(row.join(''));
    });
}

function run(input, x, y) {
    let part1 = 0;
    let part2 = 0;

    const screen = Array(y).fill('').map(() => Array(x).fill(' '));
    // show(screen);

    function get(dir, ix) {
        if (dir === 'y') {
            return screen[ix];
        } else {
            const data = [];
            for (let i = 0; i < screen.length; i++) {
                data.push(screen[i][ix]);
            }
            return data;
        }
    }

    function apply(dir, ix, data) {
        if (dir === 'y') {
            screen[ix] = data;
        } else {
            for (let i = 0; i < screen.length; i++) {
                screen[i][ix] = data[i];
            }
        }
    }

    function rotate(data, num) {
        const result = new Array(data.length);
        data.forEach((d, i) => {
            result[(i + num) % data.length] = data[i];
        });
        return result;
    }


    input
        .split('\n')
        .filter(line => line.length)
        .forEach((line) => {
            const [, command, params] = line.match(/^(\w+) (.*)/);

            let t;
            switch (command) {
                case 'rect':
                    t = params.match(/(\d+)x(\d+)/);
                    const rows = +t[2];
                    const cols = +t[1];

                    for (let row = 0; row < rows; row++) {
                        for (let col = 0; col < cols; col++) {
                            try {

                                screen[row][col] = '#';
                            } catch (e) {
                                show(screen);
                                debugger;
                            }
                        }
                    }
                    break;
                case 'rotate':
                    t = params.match(/\w+ (x|y)=(\d+) by (\d+)/);
                    const dir = t[1];
                    const ix = +t[2];
                    const num = +t[3];

                    const data = get(dir, ix);
                    const rotated = rotate(data, num);
                    apply(dir, ix, rotated);

                    break;
                default:
                    process.exit(1);
            }

            // console.log(line);
            // show(screen);
            // console.log('');
        });

    screen.forEach(row => {
        row.forEach(char => {
            if (char === '#') {
                part1++;
            }
        });
    });

    show(screen);

    return [part1, part2];
}

// const testResult = run(testInput, 7, 3);
// console.log('test: ', testResult.join(' / '));

const result = run(input, 50, 6);
console.log('result: ', result.join(' / '));
// !66
