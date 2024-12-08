const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = 0;
    let lines = readInput(input);

    let mode = 'rules';
    let rules = [];

    for (let lineIx = 0; lineIx < lines.length; lineIx++) {
        let line = lines[lineIx];
        if (line === '') {
            mode = 'lists';
            continue;
        }

        if (mode === 'rules') {
            rules.push(line.split('|').map((x) => Number(x)));
            continue;
        }

        let list = line.split(',').map((x) => Number(x));
        let ok = true;
        for (let [a, b] of rules) {
            let aix = list.indexOf(a);
            let bix = list.indexOf(b);
            if (aix !== -1 && bix !== -1) {
                if (aix > bix) {
                    ok = false;
                    break;
                }
            }
        }

        if (ok) {
            part1 += list[Math.floor(list.length / 2)];
            continue;
        }

        let newList = [];
        nextLetter: while (list.length) {
            let usedRules = rules.filter(([a, b]) => list.includes(a) && list.includes(b));
            for (let num of list) {
                if (usedRules.some(([a, b]) => b === num)) {
                    continue;
                } else {
                    newList.push(num);
                    list = list.filter((x) => x !== num);
                    continue nextLetter;
                }
            }
            throw new Error('no solution');
        }

        part2 += newList[Math.floor(newList.length / 2)];
    }

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
