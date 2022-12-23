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
root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32
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

    const nodes = {};

    const ops = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '*': (a, b) => a * b,
        '/': (a, b) => a / b
    };

    lines.forEach((line, ix) => {
        const parts = line.split(' ');
        const name = parts[0].slice(0, -1);
        const node = { name };
        if (parts.length === 2) {
            node.value = +parts[1];
        } else {
            node.p1 = parts[1];
            node.p2 = parts[3];
            node.op = ops[parts[2]];
            node.strOp = parts[2];
        }
        nodes[name] = node;
    });

    function resolve(node) {
        if (node.value !== undefined) {
            return {
                value: node.value,
                humn: node.name === 'humn'
            };
        }
        const p1 = resolve(nodes[node.p1]);
        const p2 = resolve(nodes[node.p2]);

        const value = node.op(p1.value, p2.value);
        const humn = p1.humn || p2.humn;
        if (!humn) {
            node.value = value;
        }

        return { value, humn };
    }

    const root = nodes['root'];
    part1 = resolve(root).value;
    console.log(part1, resolve(root).value);

    let str = p(nodes[root.p1]) + ' === ' + p(nodes[root.p2]);
    console.log(str);
    function p(node) {
        if (node.name === 'humn') {
            return 'HUMN';
        }
        if (node.value !== undefined) {
            return node.value;
        }
        return `(${p(nodes[node.p1])} ${node.strOp} ${p(nodes[node.p2])})`;
    }

    function simp(node) {
        if (node.name === 'humn') {
            return {
                k: 1,
                n: 0
            };
        }
        if (node.value !== undefined) {
            return node.value;
        }

        let a = simp(nodes[node.p1]);
        let b = simp(nodes[node.p2]);

        let [x, num] = typeof a === 'object' ? [a, b] : [b, a];

        if (node.strOp === '+') {
            x.n = x.n + num;
        } else if (node.strOp === '*') {
            x.k = x.k * num;
            x.n = x.n * num;
        } else if (node.strOp === '/') {
            // order would matter, but seems input is not nasty in that way
            x.k = x.k / num;
            x.n = x.n / num;
        } else if (node.strOp === '-') {
            if (typeof a === 'object') {
                x.n = x.n - num;
            } else {
                x.k = -x.k;
                x.n = num - x.n;
            }
        }
        return x;
    }

    const a = simp(nodes[root.p1]);
    const b = simp(nodes[root.p2]);
    console.log(a);
    console.log(b);

    part2 = Math.round((b - a.n) / a.k);

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
