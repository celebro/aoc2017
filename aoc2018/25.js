const fs = require('fs');
const sscanf = require('scan.js').scan;
// @ts-ignore
const Grid = require('../utils/Grid');
// @ts-ignore
const List = require('../utils/LinkedList');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch(e) {}
const testInput = `
1,-1,0,1
2,0,-1,0
3,2,-1,0
0,0,3,1
0,0,-1,-1
2,3,-2,0
-2,2,0,0
2,-2,0,-1
1,-1,0,-1
3,2,0,2
`
.trim();

function distance(a, b) {
    const d = Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]) + Math.abs(a[3] - b[3]);
    return d;
}

function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter(line => line.length);

    const sets = [];

    lines.forEach(line => {
        const point = line.split(',').map(x => +x);
        const matchedDistance = [];
        sets.forEach((set, i) => {
            if (set.some(p => distance(p, point) <= 3)) {
                matchedDistance.push(i);
            }
        });

        if (matchedDistance.length > 0) {
            const firstSet = sets[matchedDistance[0]];
            firstSet.push(point);
            while (matchedDistance.length > 1) {
                let setIndex = matchedDistance.pop();
                firstSet.push(...sets[setIndex]);
                sets.splice(setIndex, 1);
            }
        } else {
            sets.push([point]);
        }
    });

    part1 = sets.length;

    return [part1, part2];
}

const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));
