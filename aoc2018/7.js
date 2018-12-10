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

    console.time('part1');
    const nodes = new Map();
    function getNode(id) {
        if (!nodes.has(id)) {
            const node = { id: id, children: [], parents1: 0, parents2: 0 };
            nodes.set(id, node);
        }
        return nodes.get(id);
    }

    lines.forEach((line, ix) => {
        const parts = line.split(' ');
        let node1 = getNode(parts[1]);
        let node2 = getNode(parts[7]);
        node1.children.push(node2);
        node2.parents1++;
        node2.parents2++;
    });

    let list1 = Array.from(nodes.values()).filter(x => x.parents1 === 0);
    // console.log(list1.map(x => x.id));

    part1 = '';
    while (list1.length) {
        list1.sort((a, b) => b.id.codePointAt(0) - a.id.codePointAt(0));
        const next = list1.pop();
        part1 += next.id;
        next.children.forEach(child => {
            child.parents1 = child.parents1 - 1;
            if (child.parents1 === 0) {
                list1.push(child);
            }
        });
    }
    console.timeEnd('part1');

    console.time('part2');
    let time = 0;

    let list2 = Array.from(nodes.values()).filter(x => x.parents2 === 0);
    const workers = [];
    while (list2.length || workers.length) {
        list2.sort((a, b) => b.id.codePointAt(0) - a.id.codePointAt(0));

        while (workers.length < numWorkers && list2.length > 0) {
            const next = list2.pop();
            workers.push({ time: time + cost + next.id.codePointAt(0) - 'A'.codePointAt(0) + 1, id: next.id, node: next });
        }

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
            w.node.children.forEach(child => {
                child.parents2 = child.parents2 - 1;
                if (child.parents2 === 0) {
                    list2.push(child);
                }
            });
        }
    }

    part2 = time;
    console.timeEnd('part2');

    return [part1, part2];
}

const testResult = run(testInput, 2, 0);
console.log('test: ', testResult.join(' / '));

const result = run(input, 5, 60);
console.log('result: ', result.join(' / '));
