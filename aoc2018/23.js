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
pos=<10,12,12>, r=2
pos=<12,14,12>, r=2
pos=<16,12,12>, r=4
pos=<14,14,14>, r=6
pos=<50,50,50>, r=200
pos=<10,10,10>, r=5
`
.trim();

const deltas = [
    [1, 0, 0],
    [-1, 0, 0],
    [0, 1, 0],
    [0, -1, 0],
    [0, 0, 1],
    [0, 0, -1]
];

function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter(line => line.length);

    let largest = -1;
    const bots = [];

    let minx = Infinity;
    let maxx = -Infinity;

    lines.forEach((line, ix) => {
        const [x, y, z, r] = sscanf(line, 'pos=<%d,%d,%d>, r=%d');
        if (largest === -1 || bots[largest].r < r) {
            largest = ix;
        }
        bots.push({ x, y, z, r });

        if (x < minx) {
            minx = x;
        }
        if (x > maxx) {
            maxx = x;
        }
    });

    const strongestBot = bots[largest];

    part1 = 0;
    bots.forEach(({ x, y, z, r }) => {
        const d = Math.abs(x - strongestBot.x) + Math.abs(y - strongestBot.y) + Math.abs(z - strongestBot.z);
        if (d <= strongestBot.r) {
            part1++;
        }

    });

    function getBest(coordGetter) {
        let bestx = [];
        let bestxcount = 0;

        for (let i = 0; i < bots.length; i++) {
            const a = bots[i];
            let count = 0;
            for (let j = 0; j < bots.length; j++) {
                const b = bots[j];
                // if (Math.abs(a.x - b.x) < a.r) {
                //     // count++;
                // }
                if (Math.abs(coordGetter(a) - coordGetter(b)) < b.r) {
                    count++;
                }
            }
            if (count >= bestxcount) {
                if (count > bestxcount) {
                    bestx = [];
                }
                bestxcount = count;
                bestx.push(a.x);
            }
        }

        return bestx;
    }


    const bestx = getBest(x => x.x);
    const besty = getBest(x => x.y);
    const bestz = getBest(x => x.z);

    let bestPoint = null;
    let bestCount = 0;

    for (let x of bestx) {
        for (let y of besty) {
            for (let z of bestz) {
                let count = 0;
                for (let bot of bots) {
                    const d = Math.abs(x - bot.x) + Math.abs(y - bot.y) + Math.abs(z - bot.z);
                    if (d <= bot.r) {
                        count++;
                    }
                }
                if (count >= bestCount) {
                    bestPoint = { x, y, z };
                    bestCount = count;

                    let changed = true;
                    while (changed) {
                        changed = false;
                        for (let [dx, dy, dz] of deltas) {
                            let x = bestPoint.x + dx;
                            let y = bestPoint.y + dy;
                            let z = bestPoint.z + dz;

                            let count = 0;
                            for (let bot of bots) {
                                const d = Math.abs(x - bot.x) + Math.abs(y - bot.y) + Math.abs(z - bot.z);
                                if (d <= bot.r) {
                                    count++;
                                }
                            }

                            console.log(bestCount, dx, dy, dz, count);

                            if (count > bestCount) {
                                bestPoint = { x, y, z };
                                bestCount = count;
                                console.log(bestPoint, bestCount, Math.abs(bestPoint.x) + Math.abs(bestPoint.y) + Math.abs(bestPoint.z));
                                changed = true;
                                break;
                            }
                        }
                    }
                }
            }
        }
    }

    console.log(bestPoint, bestCount);
    part2 = Math.abs(bestPoint.x) + Math.abs(bestPoint.y) + Math.abs(bestPoint.z);


    return [part1, part2];
}

// const testResult = run(testInput);
// console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));

// too high 128139428
