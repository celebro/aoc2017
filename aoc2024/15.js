const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
#######
#...#.#
#.....#
#..OO@#
#..O..#
#.....#
#######

<vv<<^^<<^^
`,
    `
##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^
`
].map((x) => x.trim());

const dirs = {
    '>': [1, 0],
    '<': [-1, 0],
    v: [0, 1],
    '^': [0, -1]
};

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = 0;
    let lines = readInput(input);

    let mode = 'map';
    let map = new Grid();
    let map2 = new Grid();
    let path = [];
    let pos = { x: 0, y: 0 };
    let pos2 = { x: 0, y: 0 };

    for (let y = 0; y < lines.length; y++) {
        let line = lines[y];
        if (line === '') {
            mode = 'path';
            continue;
        }

        for (let x = 0; x < line.length; x++) {
            let char = line[x];
            if (mode === 'map') {
                map.set(x, y, char);
                if (char === '#' || char === '.') {
                    map2.set(2 * x, y, char);
                    map2.set(2 * x + 1, y, char);
                }
                if (char === '@') {
                    map2.set(2 * x, y, '@');
                    map2.set(2 * x + 1, y, '.');
                }
                if (char === 'O') {
                    map2.set(2 * x, y, '[');
                    map2.set(2 * x + 1, y, ']');
                }

                if (char === '@') {
                    pos = { x, y };
                    pos2 = { x: 2 * x, y };
                }
            } else {
                path.push(dirs[char]);
            }
        }
    }

    function move(x, y, dx, dy) {
        let current = map.get(x, y);
        let next = map.get(x + dx, y + dy);

        if (next === '#') {
            return false;
        }

        if (next === 'O') {
            move(x + dx, y + dy, dx, dy);
            next = map.get(x + dx, y + dy);
        }

        if (next === '.') {
            map.set(x, y, '.');
            map.set(x + dx, y + dy, current);
            return true;
        }

        return false;
    }

    for (let [dx, dy] of path) {
        if (move(pos.x, pos.y, dx, dy)) {
            pos.x += dx;
            pos.y += dy;
        }
    }

    map.forEach((char, x, y) => {
        if (char === 'O') {
            part1 += y * 100 + x;
        }
    });

    //////

    function clear(x, y, dx, dy) {
        let current = map2.get(x, y);
        if (current === '.') {
            return true;
        }
        if (current === '#') {
            return false;
        }

        if (dy === 0) {
            if (clear(x + dx, y + dy, dx, dy)) {
                map2.set(x + dx, y + dy, current);
                map2.set(x, y, '.');
                return true;
            }
            return false;
        } else {
            let places = [[x, y]];
            if (current === '[') {
                places.push([x + 1, y]);
            } else if (current === ']') {
                places.push([x - 1, y]);
            }

            if (places.every(([xx, yy]) => clear(xx + dx, yy + dy, dx, dy))) {
                places.forEach(([xx, yy]) => {
                    map2.set(xx + dx, yy + dy, map2.get(xx, yy));
                    map2.set(xx, yy, '.');
                });
                return true;
            }
            return false;
        }
    }

    // map2.print();

    for (let [dx, dy] of path) {
        let copy = new Grid();
        map2.forEach((char, x, y) => {
            copy.set(x, y, char);
        });

        if (clear(pos2.x + dx, pos2.y + dy, dx, dy)) {
            map2.set(pos2.x + dx, pos2.y + dy, '@');
            map2.set(pos2.x, pos2.y, '.');
            pos2.x += dx;
            pos2.y += dy;
        } else {
            map2 = copy;
        }

        // map2.print();
    }

    map2.forEach((char, x, y) => {
        if (char === '[') {
            part2 += y * 100 + x;
        }
    });

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
