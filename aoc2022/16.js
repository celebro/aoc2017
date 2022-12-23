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
Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter((line) => line.length);

    const graph = {};

    lines.forEach((line, ix) => {
        const [src, rate] = sscanf(line, 'Valve %s has flow rate=%d;');
        let dest = line.split(/valves? /)[1].split(', ');
        graph[src] = { src, rate, dest };
    });

    const distances = {};

    for (const node of Object.values(graph)) {
        if (node.src === 'AA' || node.rate > 0) {
            const list = new List();
            list.enq(node.src);

            const dist = {};
            dist[node.src] = 0;

            while (!list.isEmpty()) {
                const label = list.deq();
                const n = graph[label];
                for (const nextLabel of n.dest) {
                    const nextNode = graph[nextLabel];
                    if (!dist[nextNode.src]) {
                        dist[nextNode.src] = dist[n.src] + 1;
                        list.enq(nextLabel);
                    }
                }
            }

            delete dist[node.src];
            distances[node.src] = dist;
        }
    }

    const nodes = Object.keys(distances).filter((x) => x !== 'AA');
    let selected = {};

    function rec(time, current, path) {
        path = (path ? path + '-' : '') + current;
        let best = 0;
        let bestPath = '';

        for (const next of nodes) {
            if (selected[next]) {
                continue;
            }

            const remainingTime = time - distances[current][next] - 1;
            if (remainingTime >= 0) {
                selected[next] = true;
                const r = rec(remainingTime, next, path);
                selected[next] = false;
                if (r.pressure >= best) {
                    best = r.pressure;
                    bestPath = r.path;
                }
            }
        }

        // if (path === 'AA-DD-BB-JJ-HH-EE-CC') debugger;

        return { pressure: best + graph[current].rate * time, path: current + '-' + bestPath };
    }

    const r = rec(30, 'AA', '');
    part1 = r.pressure;
    // console.log(r.path);

    ///////////////////
    selected = {};

    function rec2(time, current, player) {
        let best = 0;

        for (const next of nodes) {
            if (selected[next]) {
                continue;
            }

            const remainingTime = time - distances[current][next] - 1;
            if (remainingTime >= 0) {
                selected[next] = true;
                const pressure = rec2(remainingTime, next, player);
                selected[next] = false;
                if (pressure >= best) {
                    best = pressure;
                }
            }
        }

        if (player === 1 && time < 26) {
            let bestIfStopped = rec2(26, 'AA', 2);
            if (bestIfStopped > best) {
                best = bestIfStopped;
            }
        }

        return best + graph[current].rate * time;
    }

    part2 = rec2(26, 'AA', 1);

    return [part1, part2];
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
