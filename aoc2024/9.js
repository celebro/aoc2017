const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
2333133121414131402
`,
    `12345`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

function readDisk(line) {
    let data = [];
    let id = 0;
    let isFile = true;

    let emptyByLength = [];
    let idLength = {};
    let idToIndex = {};

    for (let char of line) {
        let num = parseInt(char);

        let datum;
        if (isFile) {
            datum = id;
            idLength[id] = num;
            idToIndex[id] = data.length;
            id++;
        } else {
            if (num > 0) {
                emptyByLength[num] = emptyByLength[num] || [];
                emptyByLength[num].push(data.length);
            }
            datum = -1;
        }
        for (let i = 0; i < num; i++) {
            data.push(datum);
        }
        isFile = !isFile;
    }

    for (let i = 0; i < 10; i++) {
        emptyByLength[i] = emptyByLength[i] || [];
        emptyByLength[i].reverse();
    }

    return { data, emptyByLength, idLength, idToIndex };
}

function p1(disk) {
    let data = disk.data;
    let tail = data.length - 1;
    let head = 0;

    while (true) {
        while (data[head] !== -1) {
            head++;
        }
        if (head > tail) {
            break;
        }

        data[head] = data[tail];
        data[tail] = -1;

        while (data[tail] === -1) {
            tail--;
        }
    }
    return disk;
}

function checksum({ data }) {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
        if (data[i] !== -1) {
            sum += i * data[i];
        }
    }
    return sum;
}

function p2(disk) {
    let data = disk.data;
    let tail = data.length - 1;

    function findFirstEmptySpace(length, upperBound) {
        let emptySpaceOfLength;
        for (let i = length; i < 10; i++) {
            if (disk.emptyByLength[i].length) {
                if (!emptySpaceOfLength || disk.emptyByLength[i].at(-1) < disk.emptyByLength[emptySpaceOfLength].at(-1)) {
                    emptySpaceOfLength = i;
                }
            }
        }

        if (emptySpaceOfLength) {
            let emptySpaceIndex = disk.emptyByLength[emptySpaceOfLength].pop();
            if (emptySpaceIndex < upperBound) {
                if (emptySpaceOfLength > length) {
                    let remaining = emptySpaceOfLength - length;
                    disk.emptyByLength[remaining].push(emptySpaceIndex + length);
                    bubbleSortTop(disk.emptyByLength[remaining]);
                }
                return emptySpaceIndex;
            }
        }
        return undefined;
    }

    for (let id = data[tail]; id > 0; id--) {
        // console.log(data.map((x) => (x === -1 ? '.' : `${x}`)).join(''));

        let dataIx = disk.idToIndex[id];
        let length = disk.idLength[id];
        let ix = findFirstEmptySpace(length, dataIx);

        if (ix) {
            for (let i = 0; i < length; i++) {
                data[ix + i] = id;
                data[dataIx + i] = -1;
            }
        }
    }

    return disk;
}

function bubbleSortTop(arr) {
    let val = arr.at(-1);
    for (let i = arr.length - 1; i > 0; i--) {
        if (val > arr[i - 1]) {
            arr[i] = arr[i - 1];
        } else {
            arr[i] = val;
            break;
        }
    }
}

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = undefined;
    let line = readInput(input)[0];

    part1 = checksum(p1(readDisk(line)));
    part2 = checksum(p2(readDisk(line)));

    // console.log(disk.map((x) => (x === -1 ? '.' : `${x}`)).join(''));

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
