const fs = require('fs');
const sscanf = require('scan.js').scan;
const Queue = require('priorityqueuejs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch(e) {}
const testInput = `
pos=<10,12,12>, r=2
pos=<12,14,12>, r=2
pos=<16,12,12>, r=4
pos=<14,14,14>, r=6
pos=<50,50,50>, r=200
pos=<10,10,10>, r=5
`
.trim();

function distance(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z);
}

function vectorSum(vec) {
    return Math.abs(vec.x) + Math.abs(vec.y) + Math.abs(vec.z);
}

function bisectSplit(min, max) {
    let mid = Math.floor((min + max) / 2);

    if (min === max) {
        return [[min, max]];
    }

    return [[min, mid], [mid + 1, max]];
}

function getClosest(min, max, bot) {
    let value;
    if (min <= bot && bot <= max) {
        value = bot;
    } else if (bot < min) {
        value = min;
    } else {
        value = max;
    }

    return value;
}

function run(input) {
    let part1 = 0;
    let part2 = 0;
    const lines = input.split('\n').filter(line => line.length);

    let bots = [];
    lines.forEach(line => {
        const [x, y, z, r] = sscanf(line, 'pos=<%d,%d,%d>, r=%d');
        bots.push({
            x, y, z, r,
            intersectCount: 0
        });
    });


    const strongestBot = bots.reduce((bot1, bot2) => bot1.r > bot2.r ? bot1: bot2);
    bots.forEach(bot => {
        if (distance(bot, strongestBot) <= strongestBot.r) {
            part1++;
        }
    });


    // Determine which bots will be in range of the point we're looking for.
    // Can be calculated by checking number of intersections of bots' ranges:
    // If there are X bots in range of the target point, there exists a group
    // of X bots whose ranges intersect
    while (true) {
        for (const bot of bots) {
            bot.intersectCount = 0;
        }
        for (let i = 0; i < bots.length; i++) {
            const a = bots[i];
            a.intersectCount++; // 'self' intersect, makes inequalities easier later
            for (let j = i + 1; j < bots.length; j++) {
                const b = bots[j];
                if (distance(a, b) <= a.r + b.r) {
                    a.intersectCount++;
                    b.intersectCount++;
                }
            }
        }

        // Bucket sort ...
        const histogram = new Uint16Array(bots.length);
        for (const bot of bots) {
            histogram[bot.intersectCount]++;
        }

        let minIntersections = 0;
        let sumBots = 0;
        for (let i = histogram.length - 1; i >= 0; i--) {
            sumBots += histogram[i];
            if (sumBots === i) {
                minIntersections = i;
                break;
            } else if (sumBots > i) {
                // Would be previous histrogram index with any data, but doesn't matter,
                // since this variable is only used for inequality in the filter
                minIntersections = i + 1;
                break;
            }
        }

        const newBots = bots.filter(bot => bot.intersectCount >= minIntersections);

        if (newBots.length === bots.length) {
            break;
        } else {
            bots = newBots;
        }
    }

    const min = { x: -Infinity, y: -Infinity, z: -Infinity };
    const max = { x:  Infinity, y:  Infinity, z:  Infinity };

    // Min bounding box encompassing all bots
    for (const bot of bots) {
        min.x = Math.max(min.x, bot.x - bot.r);
        min.y = Math.max(min.y, bot.y - bot.r);
        min.z = Math.max(min.z, bot.z - bot.r);
        max.x = Math.min(max.x, bot.x + bot.r);
        max.y = Math.min(max.y, bot.y + bot.r);
        max.z = Math.min(max.z, bot.z + bot.r);
    }

    // console.table([min, max]);
    // console.log(min.x + min.y + min.z, max.x + max.y + max.z);


    const queue = new Queue((a, b) => vectorSum(b.min) + vectorSum(b.max) - vectorSum(a.min) - vectorSum(a.max));
    queue.enq({ min, max });

    let found = false;
    while (queue.size() > 0 && !found) {
        const { min, max } = queue.deq();
        for (const [x1, x2] of bisectSplit(min.x, max.x)) {
            for (const [y1, y2] of bisectSplit(min.y, max.y)) {
                for (const [z1, z2] of bisectSplit(min.z, max.z)) {
                    const min = { x: x1, y: y1, z: z1 };
                    const max = { x: x2, y: y2, z: z2 };

                    let valid = bots.every(bot => {
                        let x = getClosest(min.x, max.x, bot.x);
                        let y = getClosest(min.y, max.y, bot.y);
                        let z = getClosest(min.z, max.z, bot.z);

                        return Math.abs(x - bot.x) + Math.abs(y - bot.y) + Math.abs(z - bot.z) <= bot.r;
                    });

                    if (valid) {
                        if (x1 === x2 && y1 === y2 && z1 === z2 && !part2) {
                            found = true;
                            part2 = vectorSum(min);
                        }
                        queue.enq({ min, max });
                    }
                }
            }
        }
    }

    return [part1, part2];
}

const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

console.time('time');
const result = run(input);
console.timeEnd('time');
console.log('result: ', result.join(' / '));
