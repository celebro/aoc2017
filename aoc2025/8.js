const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 * @param {number} pairs
 */
function run(input, pairs) {
    let part1 = undefined;
    let part2 = undefined;
    let lines = readInput(input);

    let list = [];

    for (let lineIx = 0; lineIx < lines.length; lineIx++) {
        let line = lines[lineIx];
        list.push(sscanf(line, '%d,%d,%d'));
    }

    let distances = [];
    let sets = new Set();
    for (let i = 0; i < list.length - 1; i++) {
        for (let j = i + 1; j < list.length; j++) {
            let box1 = list[i];
            let box2 = list[j];
            let distance = Math.sqrt((box1[0] - box2[0]) ** 2 + (box1[1] - box2[1]) ** 2 + (box1[2] - box2[2]) ** 2);
            distances.push([distance, box1, box2]);

            box1.key = new Set();
            box1.key.add(box1);

            box2.key = new Set();
            box2.key.add(box2);

            sets.add(box1.key);
            sets.add(box2.key);
        }
    }
    distances.sort((a, b) => a[0] - b[0]);

    function print(box1, box2) {
        let x1 = [...box1];
        let x2 = [...box2];
        console.log(
            x1,
            x2,
            sets
                .values()
                .map((s) => s.size)
                .filter((s) => s > 1)
                .toArray()
        );
    }

    for (let n = 0; n < distances.length; n++) {
        let box1 = distances[n][1];
        let box2 = distances[n][2];

        if (box1.key === box2.key) {
            // noop, already in the same set
        } else {
            let killedKey = box2.key;
            for (let box of killedKey) {
                box.key = box1.key;
                box1.key.add(box);
            }
            sets.delete(killedKey);
            part2 = box1[0] * box2[0];
        }

        if (n === pairs - 1) {
            let bySize = [...sets.values()].sort((a, b) => b.size - a.size);
            part1 = bySize[0].size * bySize[1].size * bySize[2].size;
        }
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
        const testResult = run(testInput, 10);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input, 1000);
console.log('result: ', result.join(' / '));
