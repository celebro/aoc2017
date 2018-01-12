const fs = require('fs');
const Grid = require('./grid');
const Queue = require('./queue');
const PriorityQueue = require('priorityqueuejs');

const input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInput = `
Filesystem            Size  Used  Avail  Use%
/dev/grid/node-x0-y0   10T    8T     2T   80%
/dev/grid/node-x0-y1   11T    6T     5T   54%
/dev/grid/node-x0-y2   32T   28T     4T   87%
/dev/grid/node-x1-y0    9T    7T     2T   77%
/dev/grid/node-x1-y1    8T    0T     8T    0%
/dev/grid/node-x1-y2   11T    7T     4T   63%
/dev/grid/node-x2-y0   10T    6T     4T   60%
/dev/grid/node-x2-y1    9T    8T     1T   88%
/dev/grid/node-x2-y2    9T    6T     3T   66%
`.trim();

function run(input, test) {
    let part1 = 0;
    let part2 = 0;

    const grid = new Grid();
    const list = [];
    let target;
    let initialEmpty;

    input
        .split('\n')
        .filter(line => line.length)
        .forEach((line) => {
            if (line.startsWith('/dev/grid')) {
                const [, x, y, size, used, free] = line.match(/x(\d+)-y(\d+)\s+(\d+)T\s+(\d+)T\s+(\d+)T/)
                const node = {
                    x: +x,
                    y: +y,
                    size: +size,
                    used: +used,
                    free: +free,

                    minCost: Infinity,
                    situations: [], // { cost, emptyPos }
                    wall: (+used) > (test ? 20 : 100),
                    pending: false
                };

                if (node.y === 0 && (!target || target.x < node.x)) {
                    target = node;
                }
                if (node.used === 0) {
                    initialEmpty = node;
                }

                grid.set(node.x, node.y, node);
                list.push(node);
            }
        });

    // Part 1, count viable pairs
    for (let i = 0; i < list.length - 1; i++) {
        for (let j = i + 1; j < list.length; j++) {
            const a = list[i];
            const b = list[j];

            if (a.free >= b.used && b.used > 0 || b.free >= a.used && a.used > 0) {
                part1 += 1;
            }
        }
    }

    const queue = new PriorityQueue((a, b) => b.minCost - a.minCost); // TODO invert?
    // @ts-ignore
    target.situations.push({ cost: 0, emptyPos: initialEmpty });
    target.minCost = 0;
    queue.enq(target);

    let count = 0;
    while (true && queue.size() > 0) {
        const node = queue.deq();

        if (node.x === 0 && node.y === 0) {
            part2 = node.minCost;
            break;
        }


        const neighbours = [];
        [[1, 0, 'R'], [-1, 0, 'L'], [0, 1, 'U'], [0, -1, 'D']].forEach(([dx, dy, dir]) => {
            const neighbour = grid.get(node.x + dx, node.y + dy);
            if (neighbour && !neighbour.wall && neighbour.minCost > node.minCost) {
                neighbours.push(neighbour);
                neighbour.tmp = Infinity;
                neighbour.tmpDir = dir;
            }
        })

        node.situations.forEach(({ cost: situationCost, emptyPos }, ix) => {
            const neighbourCosts = findNeighbourCosts(emptyPos, node, neighbours);
            neighbourCosts.forEach(({ cost: stepCost, neighbour }) => {
                const newCost = situationCost + stepCost + 1;
                if (neighbour.tmp > newCost) {
                    neighbour.tmp = newCost;
                }
            });
        });

        neighbours.forEach(neighbour => {
            const dirCost = neighbour.situations[neighbour.tmpDir];
            if (dirCost === undefined || dirCost > neighbour.tmp) {
                neighbour.situations[neighbour.tmpDir] = neighbour.tmp;
                neighbour.situations.push({ cost: neighbour.tmp, emptyPos: node });
                if (neighbour.tmp < neighbour.minCost) {
                    neighbour.minCost = neighbour.tmp;
                }
                queue.enq(neighbour);

            }
        });

        // grid.print(n => {
        //     if (n === node) {
        //         return 'G';
        //     } else if (n.wall) {
        //         return '#';
        //     } else if (node.situations.find(({ emptyPos}) => emptyPos === n)) {
        //         return '-';
        //     } else if (neighbours.includes(n)) {
        //         return '*'
        //     } else {
        //         return '.';
        //     }
        // })

        count += 1;
        if (count % 1000 === 0) {
            console.log(count);
        }
        if (count > 10000000) {
            console.error('Possible infinite loop (main search))');
            process.exit(1);
        }
    }

    if (part2 === 0) {
        console.error('Part2 not found!');
        process.exit();
    }

    function findNeighbourCosts(start, avoid, targets) {
        const data = new Grid();
        data.set(start.x, start.y, 0);

        const queue = new Queue();
        queue.enq(start);

        let remaining = targets.length;
        let results = new Array(targets.length);
        let count = 0;
        while (queue.size() > 0 && remaining > 0) {
            const pos = queue.deq();
            const cost = data.get(pos.x, pos.y);
            [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
                const neighbour = grid.get(pos.x + dx, pos.y + dy);
                if (neighbour && !neighbour.wall && neighbour !== avoid && data.get(neighbour.x, neighbour.y) === undefined) {
                    data.set(neighbour.x, neighbour.y, cost + 1);
                    queue.enq(neighbour);

                    const ix = targets.indexOf(neighbour);
                    if (ix > -1) {
                        results[ix] = { cost: cost + 1, neighbour };
                        remaining -= 1;
                    }
                }
            });
            count += 1;
            if (count > 1000) {
                console.error('Possible infinite loop (neighbour cousts)');
                process.exit(1);
            }
        }

        if (remaining > 0) {
            console.error('Targets not found');
            process.exit(1);
        }
        return results;
    }



    return [part1, part2];
}

const testResult = run(testInput, true);
console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));
