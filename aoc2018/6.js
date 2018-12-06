const fs = require('fs');
const Grid = require('../utils/Grid');
const Queue = require('../utils/ArrayQueue');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch(e) {}
const testInput = `
1, 1
1, 6
8, 3
3, 4
5, 5
8, 9
`
.trim();


function run(input, limit) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter(line => line.length);

    const map = new Grid((x, y) => ({x, y, value: 0}));

    console.time('part1');
    const data = [];
    let minx = Number.MAX_SAFE_INTEGER, miny = Number.MAX_SAFE_INTEGER, maxx = 0, maxy = 0;
    lines.forEach((line, ix) => {
        const [x, y] = line.split(', ').map(x => +x);
        data.push([x, y, ix]);
        minx = Math.min(minx, x);
        miny = Math.min(miny, y);
        maxx = Math.max(maxx, x);
        maxy = Math.max(maxy, y);
    });

    const areas = {};
    for (let x = minx; x <= maxx; x++) {
        for (let y = miny; y <= maxy; y++) {
            let minDistance = Number.MAX_SAFE_INTEGER;
            let value = -1;
            for (const [xx, yy, ix] of data) {
                const d = Math.abs(xx - x) + Math.abs(yy - y);
                if (d < minDistance) {
                    minDistance = d;
                    value = ix;
                } else if (d === minDistance) {
                    value = -1;
                }
            }
            if (value !== -1) {
                if (x === minx || x === maxx || y === miny || y === maxy) {
                    areas[value] = Infinity;
                } else if (areas[value] !== Infinity) {
                    areas[value] = (areas[value] || 0) + 1;
                }
            }
        }
    }

    part1 = Math.max(...Object.values(areas).filter(x => x < Infinity));
    console.timeEnd('part1');


    console.time('part2');
    part2 = 0;
    for (let x = minx; x <= maxx; x++) {
        for (let y = miny; y <= maxy; y++) {
            let sum = 0;
            for (const [xx, yy] of data) {
                sum += Math.abs(xx - x) + Math.abs(yy - y);
            }
            if (sum < limit) {
                part2 += 1;
            }
        }
    }
    console.timeEnd('part2')

    return [part1, part2];
}

const testResult = run(testInput, 32);
console.log('test: ', testResult.join(' / '));

const result = run(input, 10000);
console.log('result: ', result.join(' / '));
