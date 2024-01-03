const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');
const Queue = require('priorityqueuejs');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = 0;
    const lines = input.split('\n').filter((line) => line.length);

    const bricks = [];
    lines.forEach((line, ix) => {
        const [x1, y1, z1, x2, y2, z2] = sscanf(line, '%d,%d,%d~%d,%d,%d');
        bricks.push({
            from: { x: x1, y: y1, z: z1 },
            to: { x: x2, y: y2, z: z2 },
            supportedBy: [],
            supports: [],
            count: {}
        });
    });

    bricks.sort((a, b) => a.from.z - b.from.z);

    for (let i = 0; i < bricks.length; i++) {
        const brick = bricks[i];

        let z = 1;
        for (let j = 0; j < i; j++) {
            if (intersects(brick, bricks[j])) {
                const newz = bricks[j].to.z + 1;
                if (newz > z) {
                    z = newz;
                    brick.supportedBy.length = 0;
                    brick.supportedBy.push(bricks[j]);
                } else if (newz === z) {
                    brick.supportedBy.push(bricks[j]);
                }
            }
        }

        for (const support of brick.supportedBy) {
            support.supports.push(brick);
        }

        brick.to.z = z + (brick.to.z - brick.from.z);
        brick.from.z = z;
    }

    for (const brick of bricks) {
        let canKill = true;
        for (const above of brick.supports) {
            if (above.supportedBy.length === 1) {
                canKill = false;
            }
        }
        if (canKill) {
            part1++;
        }
    }

    //
    let i = 0;
    for (const brick of bricks) {
        i++;
        let count = 0;
        const queue = new Queue((a, b) => a.from.z - b.from.z);
        queue.enq(brick);

        while (!queue.isEmpty()) {
            const b = queue.deq();

            for (const above of b.supports) {
                if (above.count[i] == undefined) {
                    above.count[i] = above.supportedBy.length;
                }
                above.count[i]--;
                if (above.count[i] === 0) {
                    count++;
                    queue.enq(above);
                }
            }
        }

        part2 += count;
    }

    return [part1, part2];
}

function intersects(a, b) {
    return intersectsDimension(a.from.x, a.to.x, b.from.x, b.to.x) && intersectsDimension(a.from.y, a.to.y, b.from.y, b.to.y);
}

function intersectsDimension(a1, a2, b1, b2) {
    if (b1 > a2 || b2 < a1) {
        return false;
    }
    return true;
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

console.time('run');
const result = run(input);
console.timeEnd('run');
console.log('result: ', result.join(' / '));
