const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb
`
].map((x) => x.trim());

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = 0;
    let lines = readInput(input);

    let available = lines[0].split(', ');
    available.sort((a, b) => a.length - b.length);

    let root = buildTree(available);

    for (let lineIx = 2; lineIx < lines.length; lineIx++) {
        let line = lines[lineIx];

        let combinations = possible2(root, line);
        if (combinations > 0) {
            part1++;
            part2 += combinations;
        }
    }

    return [part1, part2];
}

function possible2(root, line) {
    let lookup = {};

    function rec(ix) {
        if (ix === line.length) {
            return 1;
        }
        if (lookup[ix] !== undefined) {
            return lookup[ix];
        }

        let count = 0;

        let node = root;
        for (let i = ix; i < line.length; i++) {
            node = node[line[i]];
            if (!node) {
                break;
            }
            if (node.end) {
                count += rec(i + 1);
            }
        }

        lookup[ix] = count;

        return count;
    }

    return rec(0);
}

function buildTree(available) {
    let root = {};
    for (let a of available) {
        let node = root;
        for (let i = 0; i < a.length; i++) {
            let char = a[i];
            let next = node[char];

            if (!next) {
                next = {};
                node[char] = next;
            }

            if (i === a.length - 1) {
                next.end = true;
            }
            node = next;
        }
    }
    return root;
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
