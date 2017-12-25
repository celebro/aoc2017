console.time('mark');

const fs = require('fs');
const input = fs.readFileSync('./12.txt', 'utf8').trim();
const testInput = `
0 <-> 2
1 <-> 1
2 <-> 0, 3, 4
3 <-> 2, 4
4 <-> 2, 3, 6
5 <-> 6
6 <-> 4, 5
`.trim();

function run(input) {
    const childrenMap = {};
    const all = new Set();

    input.split('\n').forEach(line => {
        const [id, rest] = line.split(' <-> ');
        childrenMap[id] = rest.split(', ').map(Number);
        all.add(+id);
    })

    function add(set, id) {
        const children = childrenMap[id];
        if (set.has(id)) {
            return;
        }

        set.add(id);
        all.delete(id);

        children.forEach(child => add(set, child));
    }

    const groups = [];
    while (all.size > 0) {
        const next = all.values().next().value;
        const group = new Set();
        add(group, next, 0);
        groups.push(group);
    }

    return [groups[0].size, groups.length];
}

const testResult = run(testInput);
const result = run(input);

console.timeEnd('mark');

console.log('test: ', testResult.join(' / '));
console.log('result: ', result.join(' / '));
