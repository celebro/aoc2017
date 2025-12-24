const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out
`,
    `
svr: aaa bbb
aaa: fft
fft: ccc
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    let lines = readInput(input);

    let graph = new Map();
    for (let lineIx = 0; lineIx < lines.length; lineIx++) {
        let line = lines[lineIx];
        let [node, ...edges] = line.split(': ');
        edges = edges[0].split(' ');
        graph.set(node, edges);
    }

    function countPaths1(node) {
        if (node === 'out') {
            return 1;
        }
        let edges = graph.get(node) || [];
        let totalPaths = 0;
        for (let edge of edges) {
            totalPaths += countPaths1(edge);
        }
        return totalPaths;
    }

    part1 = countPaths1('you');

    let cache = new Map();
    function countPaths2(node, fft, dac) {
        if (node === 'out' && fft && dac) {
            return 1;
        }

        let cacheKey = `${node}-${fft}-${dac}`;
        if (cache.has(cacheKey)) {
            return cache.get(cacheKey);
        }

        let edges = graph.get(node) || [];
        let totalPaths = 0;
        if (node === 'fft') {
            fft = true;
        }
        if (node === 'dac') {
            dac = true;
        }
        for (let edge of edges) {
            totalPaths += countPaths2(edge, fft, dac);
        }
        cache.set(cacheKey, totalPaths);
        return totalPaths;
    }

    part2 = countPaths2('svr', false, false);

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
