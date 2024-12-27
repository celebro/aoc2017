/* eslint-disable no-inner-declarations */
const fs = require('fs');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn
`
].map((x) => x.trim());

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    let lines = readInput(input);

    let map = {};
    for (let lineIx = 0; lineIx < lines.length; lineIx++) {
        let line = lines[lineIx];
        let [a, b] = line.split('-');
        map[a] = map[a] || [];
        map[b] = map[b] || [];
        map[a].push(b);
        map[b].push(a);
    }

    let nodes = Object.keys(map);

    let found = new Set();

    for (let l1 of nodes) {
        for (let l2 of map[l1]) {
            for (let l3 of map[l2]) {
                if (l3 === l1) continue;

                for (let l4 of map[l3]) {
                    if (l4 === l1) {
                        if (l1.startsWith('t') || l2.startsWith('t') || l3.startsWith('t')) {
                            let trie = [l1, l2, l3].sort();
                            found.add(trie.join('-'));
                        }
                    }
                }
            }
        }
    }

    part1 = found.size;

    let largestClique = new Set();

    for (let node of nodes) {
        let connections = map[node];
        if (connections.length < largestClique.size) {
            continue;
        }

        let clique = new Set([node]);

        function r(i) {
            if (i === connections.length) {
                if (clique.size > largestClique.size) {
                    largestClique = new Set(clique);
                }
                return;
            }

            if (clique.size + connections.length - i < largestClique.size) {
                return;
            }

            for (let j = i; j < connections.length; j++) {
                let next = connections[j];
                let valid = true;
                for (let c of clique) {
                    if (!map[c].includes(next)) {
                        valid = false;
                        break;
                    }
                }
                if (valid) {
                    clique.add(next);
                    r(j + 1);
                    clique.delete(next);
                }
                r(j + 1);
            }
        }
        r(0);
    }

    part2 = [...largestClique].sort().join(',');

    return [part1, part2];
}

/**
 * @param {string} input
 */
function readInput(input) {
    let lines = input.split('\n');
    let startIx = 0;
    let endIx = lines.length;
    while (lines[startIx] === '\n' || lines[startIx] === '') {
        startIx++;
    }
    while (lines[endIx - 1] === '\n' || lines[endIx - 1] === '') {
        endIx--;
    }
    return lines.slice(startIx, endIx);
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
