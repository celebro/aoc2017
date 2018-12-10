const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch(e) {}
const testInput = `
position=< 9,  1> velocity=< 0,  2>
position=< 7,  0> velocity=<-1,  0>
position=< 3, -2> velocity=<-1,  1>
position=< 6, 10> velocity=<-2, -1>
position=< 2, -4> velocity=< 2,  2>
position=<-6, 10> velocity=< 2, -2>
position=< 1,  8> velocity=< 1, -1>
position=< 1,  7> velocity=< 1,  0>
position=<-3, 11> velocity=< 1, -2>
position=< 7,  6> velocity=<-1, -1>
position=<-2,  3> velocity=< 1,  0>
position=<-4,  3> velocity=< 2,  0>
position=<10, -3> velocity=<-1,  1>
position=< 5, 11> velocity=< 1, -2>
position=< 4,  7> velocity=< 0, -1>
position=< 8, -2> velocity=< 0,  1>
position=<15,  0> velocity=<-2,  0>
position=< 1,  6> velocity=< 1,  0>
position=< 8,  9> velocity=< 0, -1>
position=< 3,  3> velocity=<-1,  1>
position=< 0,  5> velocity=< 0, -1>
position=<-2,  2> velocity=< 2,  0>
position=< 5, -2> velocity=< 1,  2>
position=< 1,  4> velocity=< 2,  1>
position=<-2,  7> velocity=< 2, -2>
position=< 3,  6> velocity=<-1, -1>
position=< 5,  0> velocity=< 1,  0>
position=<-6,  0> velocity=< 2,  0>
position=< 5,  9> velocity=< 1, -2>
position=<14,  7> velocity=<-2,  0>
position=<-3,  6> velocity=< 2, -1>
`
.trim();


function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter(line => line.length);

    const points = [];
    lines.forEach((line, ix) => {
        const [x, y, dx, dy] = sscanf(line.replace(/ /g, ''), 'position=<%d,%d>velocity=<%d,%d>');
        points.push({ x, y, dx, dy });
    });

    let last;
    let i = 0;
    while (true) {
        let map = new Grid();
        for (const point of points) {
            point.x += point.dx;
            point.y += point.dy;
            map.set(point.x, point.y, '#');
        }
        // console.log(i++, map.maxRow - map.minRow, map.maxCol - map.minCol);

        if (last && (map.maxRow - map.minRow > last.maxRow - last.minRow)) {
            last.print(x => x ? '#' : '.');
            console.log(i);
            break;
        }

        last = map;
        i++;
    }
}

const testResult = run(testInput);

const result = run(input);
