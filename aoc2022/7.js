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
$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = 0;
    const lines = input.split('\n').filter((line) => line.length);

    const root = new Dir('/');
    let dir = root;

    lines.forEach((line, ix) => {
        if (line.startsWith('$')) {
            const [_, command, param] = line.split(' ');
            if (command === 'cd') {
                if (param === '/') {
                    dir = root;
                } else if (param === '..') {
                    dir = dir.parent;
                } else {
                    dir = dir.children.find((child) => child.name === param);
                }
            } else if (command === 'ls') {
                // nothing, really
            } else {
                throw new Error('unknown command');
            }
        } else {
            const [p1, name] = line.split(' ');
            if (p1 === 'dir') {
                dir.children.push(new Dir(name, dir));
            } else {
                dir.children.push(new File(name, +p1));
            }
        }
    });

    const dirSizes = [];

    function visit1(dir) {
        let sum = 0;
        for (const child of dir.children) {
            if (child instanceof Dir) {
                sum += visit1(child);
            } else {
                sum += child.size;
            }
        }

        if (sum <= 100000) {
            part1 += sum;
        }

        dirSizes.push(sum);

        return sum;
    }

    const total = visit1(root);

    const needed = total - (70000000 - 30000000);
    part2 = Infinity;
    for (const size of dirSizes) {
        if (size > needed && size < part2) {
            part2 = size;
        }
    }

    return [part1, part2];
}

class Dir {
    children = [];
    constructor(name, parent) {
        this.name = name;
        this.parent = parent;
    }
}

class File {
    constructor(name, size) {
        this.size = size;
        this.name = name;
    }
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
