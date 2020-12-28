const fs = require('fs');
const sscanf = require('scan.js').scan;
// @ts-ignore
const Grid = require('../utils/Grid');
// @ts-ignore
const List = require('../utils/LinkedList');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
sesenwnenenewseeswwswswwnenewsewsw
neeenesenwnwwswnenewnwwsewnenwseswesw
seswneswswsenwwnwse
nwnwneseeswswnenewneswwnewseswneseene
swweswneswnenwsewnwneneseenw
eesenwseswswnenwswnwnwsewwnwsene
sewnenenenesenwsewnenwwwse
wenwwweseeeweswwwnwwe
wsweesenenewnwwnwsenewsenwwsesesenwne
neeswseenwwswnwswswnw
nenwswwsewswnenenewsenwsenwnesesenew
enewnwewneswsewnwswenweswnenwsenwsw
sweneswneswneneenwnewenewwneswswnese
swwesenesewenwneswnwwneseswwne
enesenwswwswneneswsenwnewswseenwsese
wnwnesenesenenwwnenwsewesewsesesew
nenewswnwewswnenesenwnesewesw
eneswnwswnwsenenwnwnwwseeswneewsenese
neswnwewnwnwseenwseesewsenwsweewe
wseweeenwnesenwwwswnew
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

const dirs = {
    e: [2, 0],
    w: [-2, 0],
    se: [1, -1],
    sw: [-1, -1],
    ne: [1, 1],
    nw: [-1, 1]
};

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter((line) => line.length);

    const paths = [];

    lines.forEach((line, ix) => {
        const path = [];
        paths.push(path);

        let last = '';
        for (const char of line) {
            const dir = dirs[last + char];
            if (dir) {
                path.push(dir);
                last = '';
            } else {
                last = char;
            }
        }
    });

    let grid = new Grid();

    for (const path of paths) {
        let x = 0;
        let y = 0;
        for (const [dx, dy] of path) {
            x += dx;
            y += dy;
        }
        let value = grid.get(x, y);
        grid.set(x, y, !value);
    }

    part1 = 0;
    grid.forEach((value) => {
        if (value) {
            part1++;
        }
    });

    ////////////////

    for (let i = 0; i < 100; i++) {
        const count = new Grid();
        const nextGrid = new Grid();

        grid.forEach((value, x, y) => {
            count.set(x, y, count.get(x, y) || 0);
            if (value) {
                for (const [dx, dy] of Object.values(dirs)) {
                    count.set(x + dx, y + dy, (count.get(x + dx, y + dy) || 0) + 1);
                }
            }
        });

        count.forEach((value, x, y) => {
            const black = grid.get(x, y);
            if (black) {
                if (value === 0 || value > 2) {
                    // nextGrid.set(x, y, false);
                } else {
                    nextGrid.set(x, y, true);
                }
            } else {
                if (value === 2) {
                    nextGrid.set(x, y, true);
                }
            }
        });

        grid = nextGrid;
    }

    part2 = 0;
    grid.forEach((value) => {
        if (value) {
            part2++;
        }
    });

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
