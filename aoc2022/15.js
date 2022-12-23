const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input, rowY, max) {
    let part1 = 0;
    let part2 = undefined;
    const lines = input.split('\n').filter((line) => line.length);

    const grid = new Grid();
    /** @type {{ sensor: { x: number, y: number }, beacon: { x: number, y: number }, dist: number }[]} */
    const items = [];

    lines.forEach((line, ix) => {
        const [sx, sy, bx, by] = sscanf(line, 'Sensor at x=%d, y=%d: closest beacon is at x=%d, y=%d');
        items.push({
            sensor: { x: sx, y: sy },
            beacon: { x: bx, y: by },
            dist: Math.abs(sx - bx) + Math.abs(sy - by)
        });
        grid.set(sx, sy, 'S');
        grid.set(bx, by, 'B');
        // sensors.push({ x: sx, y: sy });
        // beacons.push({ x: bx, y: by });
    });

    // let set = new Set();

    // for (let item of items) {
    //     const { sensor, beacon, dist } = item;
    //     const dy = Math.abs(sensor.y - rowY);
    //     const dx = dist - dy;
    //     if (dx > 0) {
    //         for (let x = sensor.x - dx; x <= sensor.x + dx; x++) {
    //             if (!grid.get(x, rowY)) {
    //                 set.add(x);
    //                 grid.set(x, rowY, '#');
    //             }
    //         }
    //     }
    // }

    // // grid.print();
    // // console.log(set.size);
    // part1 = set.size;

    console.time('loop');
    for (let row = 0; row <= max; row++) {
        /** @type {{ min: number, max: number}[]} */
        let ranges = [];

        for (const { sensor, dist } of items) {
            const dy = Math.abs(sensor.y - row);
            const dx = dist - dy;
            if (dx > 0) {
                const min = sensor.x - dx;
                const max = sensor.x + dx;
                let added = false;
                for (let i = 0; i < ranges.length; i++) {
                    const r = ranges[i];
                    if (max < r.min - 1) {
                        ranges.splice(i, 0, { min, max });
                        added = true;
                        break;
                    } else if (min > r.max + 1) {
                        // continue
                    } else {
                        merge(ranges, i, min, max);
                        added = true;
                        break;
                    }
                }

                if (!added) {
                    ranges.push({ min, max });
                }
            }
        }

        if (row === rowY) {
            part1 = ranges[0].max - ranges[0].min;
        }

        if (ranges.length > 1) {
            const y = row;
            const x = ranges[0].max + 1;
            part2 = x * 4000000 + y;
        }
    }
    console.timeEnd('loop');

    return [part1, part2];
}

function merge(ranges, i, min, max) {
    const r = ranges[i];
    r.min = Math.min(r.min, min);
    r.max = Math.max(r.max, max);

    const next = ranges[i + 1];
    if (next && next.min <= r.max) {
        ranges.splice(i + 1, 1);
        merge(ranges, i, next.min, next.max);
    }
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput, 10, 20);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input, 2000000, 4000000);
console.log('result: ', result.join(' / '));
