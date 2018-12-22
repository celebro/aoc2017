const fs = require('fs');
const sscanf = require('scan.js').scan;
// @ts-ignore
const Grid = require('../utils/Grid');
// @ts-ignore
const Queue = require('priorityqueuejs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch(e) {}
const testInput = `
depth: 510
target: 10,10
`
.trim();

const ROCKY = 0;
const WET = 1;
const NARROW = 2;

const NOTHING = 0;
const TORCH = 1;
const CLIMB = 2;

function getCompatibleTool(a, b) {
    if (a === ROCKY) {
        if (b === WET) {
            return CLIMB;
        } else if (b === NARROW) {
            return TORCH;
        }
    } else if (a === WET) {
        if (b === ROCKY) {
            return CLIMB;
        } else if (b === NARROW) {
            return NOTHING;
        }
    } else if (a === NARROW) {
        if (b === ROCKY) {
            return TORCH;
        } else if (b === WET) {
            return NOTHING;
        }
    }
}

function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter(line => line.length);

    let depth = 0;
    let tx = 0, ty = 0;
    lines.forEach((line, ix) => {
        if (ix === 0) {
            const [d] = sscanf(line, 'depth: %d');
            depth = d;
        } if (ix === 1) {
            const [x, y] = sscanf(line, 'target: %d,%d');
            tx = x;
            ty = y;
        }
    });

    const map = new Grid();

    function calcPosition(x, y) {
        let geo = 0;
        if (y === 0) {
            geo = x * 16807;
        } else if (x === 0) {
            geo = y * 48271;
        } else if (x === tx && y === ty) {
            geo = 0;
        } else {
            geo = map.get(x - 1, y).err * map.get(x, y - 1).err;
        }

        let err = (geo + depth) % 20183;

        map.set(x, y, {
            x,
            y,
            geo,
            err,
            type: err % 3,
            times: [Infinity, Infinity, Infinity],
            bestTime: Infinity
        });
    }

    function ensurePosition(x, y) {
        const pos = map.get(x, y);
        if (pos === undefined) {
            let i = y;
            while (i > 0 && map.get(x, i - 1) === undefined) {
                i--;
            }
            for (; i < y; i++) {
                calcPosition(x, i);
            }
            i = x;
            while (i > 0 && map.get(i - 1, y) === undefined) {
                i--;
            }
            for (; i <= x; i++) {
                calcPosition(i, y);
            }
        }
    }

    for (let x = 0; x <= tx; x++) {
        for (let y = 0; y <= ty; y++) {
            calcPosition(x, y);
        }
    }

    function print() {
        map.print(x => {
            if (x.type === ROCKY) {
                return '.';
            } else if (x.type === WET) {
                return '=';
            } else if (x.type === NARROW) {
                return '|';
            }
        });
    }

    // print();

    part1 = 0;
    const risk = {
        [ROCKY]: 0,
        [WET]: 1,
        [NARROW]: 2
    };
    map.forEach(x => {
        part1 += risk[x.type];
    });



    const q = new Queue((a, b) => {
        // Adding manhattan distance to times changes this from Dijsktra to A*
        const aHevristic = a.time + Math.abs(a.x - tx) + Math.abs(a.y - ty);
        const bHevristic = b.time + Math.abs(b.x - tx) + Math.abs(b.y - ty);
        return bHevristic - aHevristic;
    });
    q.enq({ x: 0, y: 0, tool: TORCH, time: 0 });
    map.get(0, 0).bestTime = 0;
    map.get(0, 0).times[TORCH] = 0;

    let bestTarget = Infinity;

    while (q.size() > 0) {
        const curr = q.deq();
        const pos = map.get(curr.x, curr.y);

        // Optional early exit
        if (curr.time > pos.times[curr.tool] || curr.time - 7 >= pos.bestTime) {
            continue;
        }

        if (curr.x === tx && curr.y === ty) {
            let targetTime = curr.time;
            if (curr.tool !== TORCH) {
                targetTime += 7;
            }
            if (targetTime < bestTarget) {
                bestTarget = targetTime;
            }
        }

        if (curr.time > bestTarget) {
            break;
        }

        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const xx = curr.x + dx;
            const yy = curr.y + dy;

            if (xx < 0 || yy < 0) {
                continue;
            }

            ensurePosition(xx, yy);
            const nextPos = map.get(xx, yy);
            let nextTime = curr.time + 1;
            let tool = curr.tool;
            if (pos.type !== nextPos.type) {
                tool = getCompatibleTool(pos.type, nextPos.type);
                if (tool !== curr.tool) {
                    nextTime += 7;
                }
            }

            if (nextTime < nextPos.times[tool] && nextTime - 7 <= nextPos.bestTime) {
                nextPos.times[tool] = nextTime;
                if (nextTime < nextPos.bestTime) {
                    nextPos.bestTime = nextTime;
                }

                q.enq({ x: xx, y: yy, tool: tool, time: nextTime });
            }
        }
    }

    part2 = bestTarget;

    return [part1, part2];
}


const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

console.time('time');
const result = run(input);
console.timeEnd('time');
console.log('result: ', result.join(' / '));
