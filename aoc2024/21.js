const fs = require('fs');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
029A
980A
179A
456A
379A
`
].map((x) => x.trim());

let numpad = `
789
456
123
 0A`;

let dirpad = `
 ^A
<v>`;

function toCoords(input) {
    let lines = input.split('\n');
    lines.shift();
    let map = {};
    for (let y = 0; y < lines.length; y++) {
        for (let x = 0; x < lines[y].length; x++) {
            map[lines[y][x]] = { x, y };
        }
    }
    return map;
}

let numMap = toCoords(numpad);
let blankNumPad = { x: 0, y: 3 };
let dirMap = toCoords(dirpad);

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = 0;
    let lines = readInput(input);

    for (let lineIx = 0; lineIx < lines.length; lineIx++) {
        let line = lines[lineIx];

        let paths = findPaths(numMap, line, blankNumPad);
        for (let i = 0; i < 2; i++) {
            paths = filter(paths.flatMap((path) => findPaths(dirMap, path, { x: 0, y: 0 })));
        }
        part1 += paths[0].length * parseInt(line);

        paths = findPaths(numMap, line, blankNumPad);
        let minCount = Infinity;
        for (let path of paths) {
            let sections = path
                .split('A')
                .filter((x) => x.length)
                .map((x) => x + 'A');
            let counts = sections.map((x) => countPress(x, 25));
            let count = counts.reduce((a, b) => a + b, 0);
            minCount = Math.min(minCount, count);
        }
        part2 += minCount * parseInt(line);
    }

    return [part1, part2];
}

let cache = {};

// test 175396398527088
// data 176472888295110 too high

function countPress(section, levels) {
    if (levels === 0) {
        return section.length;
    }

    let key = section + levels;
    if (!cache[key]) {
        let count = 0;
        let nextSections = expand(section);
        // console.log(section, nextSections);
        // debugger;
        for (let nextSection of nextSections) {
            count += Math.min(...nextSection.map((section) => countPress(section, levels - 1)));
        }
        cache[key] = count;
    }
    return cache[key];
}

function expand(section) {
    let map = dirMap;
    let forbidden = { x: 0, y: 0 };

    let pos = map.A;
    let nextSections = [];

    for (let char of section) {
        let options = [];

        let next = map[char];
        let dx = next.x - pos.x;
        let dy = next.y - pos.y;

        let dxChar = dx > 0 ? '>' : dx < 0 ? '<' : '';
        let dyChar = dy > 0 ? 'v' : dy < 0 ? '^' : '';

        let dxString = dxChar.repeat(Math.abs(dx));
        let dyString = dyChar.repeat(Math.abs(dy));

        if (dx === 0 && dy === 0) {
            // ??
            // repeat the same key, noop
            options.push('A');
        } else if (dx === 0) {
            options.push(dyString + 'A');
        } else if (dy === 0) {
            options.push(dxString + 'A');
        } else {
            if (pos.x + dx === forbidden.x && pos.y === forbidden.y) {
                // can't go x first
            } else {
                options.push(dxString + dyString + 'A');
            }

            if (pos.y + dy === forbidden.y && pos.x === forbidden.x) {
                // can't go y first
            } else {
                options.push(dyString + dxString + 'A');
            }
        }

        nextSections.push(options);

        pos = next;
    }

    return nextSections;
}

function filter(paths) {
    let shortest = Infinity;
    for (let path of paths) {
        if (path.length < shortest) {
            shortest = path.length;
        }
    }
    return paths.filter((path) => path.length === shortest);
}

function findPaths(map, str, forbidden) {
    let pos = map.A;
    let path = [''];

    for (let char of str) {
        let options = [];

        let next = map[char];
        let dx = next.x - pos.x;
        let dy = next.y - pos.y;

        let dxChar = dx > 0 ? '>' : dx < 0 ? '<' : '';
        let dyChar = dy > 0 ? 'v' : dy < 0 ? '^' : '';

        let dxString = dxChar.repeat(Math.abs(dx));
        let dyString = dyChar.repeat(Math.abs(dy));

        if (dx === 0 && dy === 0) {
            // ??
            // repeat the same key, noop
            options.push('');
        } else if (dx === 0) {
            options.push(dyString);
        } else if (dy === 0) {
            options.push(dxString);
        } else {
            if (pos.x + dx === forbidden.x && pos.y === forbidden.y) {
                // can't go x first
            } else {
                options.push(dxString + dyString);
            }

            if (pos.y + dy === forbidden.y && pos.x === forbidden.x) {
                // can't go y first
            } else {
                // if (map === dirMap && options.length) {
                // ighore, maybe?
                // } else {
                options.push(dyString + dxString);
                // }
            }
        }

        let nextPath = [];

        for (let p of path) {
            for (let opt of options) {
                nextPath.push(p + opt + 'A');
            }
        }
        path = nextPath;

        pos = next;
    }

    return path;
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
