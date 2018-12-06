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


function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter(line => line.length);

    const coords = [];
    const map = new Grid((x, y) => ({x, y, value: 0}));
    lines.forEach((line, ix) => {
        const [x, y] = line.split(', ').map(x => +x);
        let q = new Queue();
        coords.push([x, y, q, ix]);
        // map.get(x, y).id = ix;
        map.get(x, y).id = String.fromCharCode('A'.codePointAt(0) + ix);


        q.enq(map.get(x, y));
    });

    const { minCol, maxCol, minRow, maxRow } = map;
    // map.print(x => x.id === undefined || x.id === -1 ? '.' : x.id);

    const width = maxCol - minCol;
    const height = maxRow - minRow;

    const sum = {};

    let any = true;
    let v = 0;
    while (any) {
        any = false;
        for (const data of coords) {
            const [x, y, queue] = data;
            // debugger;
            while(queue.peek() && queue.peek().value === v) {
                let point = queue.deq();
                any = true;
                for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
                    const x = point.x + dx;
                    const y = point.y + dy;
                    // debugger;
                    if (x >= minCol - width && x <= maxCol + width && y >= minRow - height && y <= maxRow + height) {
                        const newPoint = map.get(x, y);
                        if (newPoint.id === -1) {

                        } else if (newPoint.value === v + 1 && newPoint.id !== point.id) {
                            sum[newPoint.id]--;
                            newPoint.id = -1;
                        } else if (newPoint.id === undefined) {
                            if (sum[point.id] === undefined || sum[point.id] >= 0) {
                                sum[point.id] = (sum[point.id] || 0) + 1;
                            }

                            newPoint.id = point.id;
                            newPoint.value = point.value + 1;
                            queue.enq(newPoint);
                        }
                    } else {
                        sum[point.id] = -1;
                    }
                }
            }
        }
        // map.print(x => x.id === undefined || x.id === -1 ? '.' : x.id);
        v++;
        // debugger;
    }
    // map.print(x => x.id === undefined || x.id === -1 ? '.' : x.id);

    part1 = Math.max(...Object.values(sum)) + 1;

    // console.log('foo');
    return [part1, part2];
}

const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));
// high 4829
