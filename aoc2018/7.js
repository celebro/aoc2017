const fs = require('fs');
const sscanf = require('scan.js').scan;

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch(e) {}
const testInput = `
Step C must be finished before step A can begin.
Step C must be finished before step F can begin.
Step A must be finished before step B can begin.
Step A must be finished before step D can begin.
Step B must be finished before step E can begin.
Step D must be finished before step E can begin.
Step F must be finished before step E can begin.
`
.trim()
.replace(/, /g, '\n');


function run(input, numWorkers, cost) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter(line => line.length);

    const nodes = new Map();
    function getNode(id) {
        if (!nodes.has(id)) {
            const node = { id: id, children: [], parents: [] };
            nodes.set(id, node);
        }
        return nodes.get(id);
    }

    lines.forEach((line, ix) => {
        const [first, second] = sscanf(line, 'Step %s must be finished before step %s can begin.');
        let node1 = getNode(first);
        let node2 = getNode(second);
        node1.children.push(node2);
        node2.parents.push(node1);
    });

    // let list = Array.from(nodes.values()).filter(x => x.parents.length === 0);
    // console.log(list.map(x => x.id));

    part1 = '';
    // while (list.length) {
    //     list.sort((a, b) => b.id.codePointAt(0) - a.id.codePointAt(0));
    //     const next = list.pop();
    //     part1 += next.id;
    //     next.children.forEach(child => {
    //         child.parents = child.parents.filter(parent => parent !== next);
    //         if (child.parents.length === 0) {
    //             list.push(child);
    //         }
    //     });
    // }

    let time = 0;

    let list = Array.from(nodes.values()).filter(x => x.parents.length === 0);
    const workers = [];
    while (list.length || workers.length) {
        list.sort((a, b) => b.id.codePointAt(0) - a.id.codePointAt(0));

        while (workers.length < numWorkers && list.length > 0) {
            const next = list.pop();
            workers.push({ time: time + cost + next.id.codePointAt(0) - 'A'.codePointAt(0) + 1, id: next.id, node: next });
        }
        // console.table(workers);

        workers.sort((a, b) => {
            const diff = a.time - b.time;
            if (diff) {
                return diff;
            }
            return a.id.codePointAt(0) - b.id.codePointAt(0);

        });
        let first = workers[0];
        while (workers[0] && workers[0].time === first.time) {
            const w = workers.shift();
            time = w.time;
            part1 += w.node.id;
            w.node.children.forEach(child => {
                child.parents = child.parents.filter(parent => parent !== w.node);
                if (child.parents.length === 0) {
                    list.push(child);
                }
            });
        }
        // console.log(part1, time);
    }

    part2 = time;

    return [part1, part2];
}

const testResult = run(testInput, 2, 0);
console.log('test: ', testResult.join(' / '));

const result = run(input, 5, 60);
console.log('result: ', result.join(' / '));
