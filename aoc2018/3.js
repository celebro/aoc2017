const fs = require('fs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch(e) {}
const testInput = `
#1 @ 1,3: 4x4
#2 @ 3,1: 4x4
#3 @ 5,5: 2x2
`
.trim()
.replace(/, /g, '\n');


function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter(line => line.length);

    const map = new Map();
    function coord(x, y) {
        return x + '_' + y;
    }
    lines.forEach((line, ix) => {
        const [id, _, pos, size] = line.split(/ |: /);
        const [x, y] = pos.split(',').map(x => +x);
        const [w, h] = size.split('x').map(x => +x);

        for (let i = x; i < x + w; i++) {
            for (let j = y; j < y + h; j++) {
                map.set(coord(i, j), (map.get(coord(i, j)) || 0) + 1);
            }
        }
    });

    let sum = 0;
    for (let i = 0; i <= 1000; i++) {
        for (let j = 0; j < 1000; j++) {
            const val = map.get(coord(i, j));
            if (val > 1) {
                sum++;
            }
        }
    }
    part1 = sum;


    lines.forEach((line, ix) => {
        const [id, _, pos, size] = line.split(/ |: /);
        const [x, y] = pos.split(',').map(x => +x);
        const [w, h] = size.split('x').map(x => +x);

        let all = true;
        for (let i = x; i < x + w; i++) {
            for (let j = y; j < y + h; j++) {
                if (map.get(coord(i, j)) !== 1) {
                    all = false;
                }
            }
        }
        if (all) {
            part2 = id.substring(1);
        }
    });


    return [part1, part2];
}

const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));
