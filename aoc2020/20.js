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
Tile 2311:
..##.#..#.
##..#.....
#...##..#.
####.#...#
##.##.###.
##...#.###
.#.#.#..##
..#....#..
###...#.#.
..###..###

Tile 1951:
#.##...##.
#.####...#
.....#..##
#...######
.##.#....#
.###.#####
###.##.##.
.###....#.
..#.#..#.#
#...##.#..

Tile 1171:
####...##.
#..##.#..#
##.#..#.#.
.###.####.
..###.####
.##....##.
.#...####.
#.##.####.
####..#...
.....##...

Tile 1427:
###.##.#..
.#..#.##..
.#.##.#..#
#.#.#.##.#
....#...##
...##..##.
...#.#####
.#.####.#.
..#..###.#
..##.#..#.

Tile 1489:
##.#.#....
..##...#..
.##..##...
..#...#...
#####...#.
#..#.#.#.#
...#.#.#..
##.#...##.
..##.##.##
###.##.#..

Tile 2473:
#....####.
#..#.##...
#.##..#...
######.#.#
.#...#.#.#
.#########
.###.#..#.
########.#
##...##.#.
..###.#.#.

Tile 2971:
..#.#....#
#...###...
#.#.###...
##.##..#..
.#####..##
.#..####.#
#..#.#..#.
..####.###
..#.#.###.
...#.#.#.#

Tile 2729:
...#.#.#.#
####.#....
..#.#.....
....#..#.#
.##..##.#.
.#.####...
####.#.#..
##.####...
##..#.##..
#.##...##.

Tile 3079:
#.#.#####.
.#..######
..#.......
######....
####.#..#.
.#...#.##.
#.#####.##
..#.###...
..#.......
..#.###...
`
].map((x) => x.trim());

const monster = `
                  #
#    ##    ##    ###
 #  #  #  #  #  #
`;

const neighbours = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
];

/** @typedef {{ id: number, grid: Grid, borders: string[]}} Tile */

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;

    const tiles = parse(input);

    const corners = findCorners(tiles);
    part1 = 1;
    for (const corner of corners) {
        part1 = part1 * corner.tile.id;
    }

    ////////////////

    /** @type {Grid<Tile>} */
    const arrangement = new Grid();

    function print(tile) {
        console.log(tile.id);
        tile.grid.print((x) => x);
    }

    // Transform tiles into arrangement
    const dimension = Math.sqrt(tiles.length);
    for (let y = 0; y < dimension; y++) {
        for (let x = 0; x < dimension; x++) {
            if (x + y === 0) {
                // top-left corner, flip it to correct position
                const { tile, neighbourBorders } = corners[0];
                if (neighbourBorders.includes(4)) {
                    flipX(tile);
                }
                if (neighbourBorders.includes(1)) {
                    flipY(tile);
                }
                arrangement.set(x, y, tile);
                // print(tile);
            } else if (y === 0) {
                const last = arrangement.get(x - 1, y);
                let { neighbourTile, neighbourBorder } = findNeighbour(last, 2, tiles);
                if (neighbourBorder % 2 !== 0) {
                    rotate(neighbourTile);
                    let add = neighbourBorder / Math.abs(neighbourBorder);
                    neighbourBorder += add;
                }
                if (neighbourBorder < 0) {
                    flipY(neighbourTile);
                    neighbourBorder = Math.abs(neighbourBorder);
                }
                if (neighbourBorder === 2) {
                    flipX(neighbourTile);
                }
                arrangement.set(x, y, neighbourTile);
                // print(neighbourTile);
            } else {
                const last = arrangement.get(x, y - 1);
                let { neighbourTile, neighbourBorder } = findNeighbour(last, 3, tiles);
                if (neighbourBorder % 2 === 0) {
                    rotate(neighbourTile);
                    neighbourBorder = { 2: -3, '-2': 3, 4: -1, '-4': 1 }[neighbourBorder];
                }
                if (neighbourBorder < 0) {
                    flipX(neighbourTile);
                    neighbourBorder = Math.abs(neighbourBorder);
                }
                if (neighbourBorder === 3) {
                    flipY(neighbourTile);
                }
                arrangement.set(x, y, neighbourTile);
                // print(neighbourTile);
            }
        }
    }

    const image = new Grid();
    arrangement.forEach((tile, x, y) => {
        tile.grid.forSlice(1, 1, 8, 8, (value, dx, dy) => {
            image.set(x * 8 + dx - 1, y * 8 + dy - 1, value);
        });
    });

    // image.print();

    ///////////// here starts part2 :)

    const monsterCoords = [];
    monster
        .split('\n')
        .filter((x) => x.length)
        .forEach((line, y) => {
            line.split('').forEach((char, x) => {
                if (char === '#') {
                    monsterCoords.push([x, y]);
                }
            });
        });

    const imageTile = { grid: image, borders: [], id: 0 };
    for (let i = 0; i < 8; i++) {
        const image = imageTile.grid;

        let foundMonsters = 0;
        image.forEach((value, x, y) => {
            if (monsterCoords.every(([dx, dy]) => image.get(x + dx, y + dy) === '#')) {
                foundMonsters++;

                monsterCoords.forEach(([dx, dy]) => {
                    image.set(x + dx, y + dy, 'O');
                });
            }
        });

        if (foundMonsters) {
            part2 = 0;
            imageTile.grid.forEach((v) => {
                if (v === '#') {
                    part2++;
                }
            });
            break;
        }

        rotate(imageTile);
        if (i === 3) {
            flipX(imageTile);
        }
    }

    return [part1, part2];
}

function parse(input) {
    const lines = input.split('\n');

    /** @type {Tile[]} */
    const tiles = [];
    let tile;
    let grid = new Grid();
    let iy;
    [...lines, ''].forEach((line) => {
        if (line.length === 0) {
            if (tile) {
                tiles.push({ id: tile, grid, borders: [] });
            }
        } else if (line.startsWith('Tile')) {
            const [, id] = sscanf(line, '%s %d');
            tile = id;
            grid = new Grid();
            iy = 0;
        } else {
            line.split('').forEach((char, ix) => {
                grid.set(ix, iy, char);
            });
            iy++;
        }
    });

    for (const tile of tiles) {
        getBorders(tile);
    }

    return tiles;
}

/**
 *
 * @param {Tile} tile
 */
function getBorders(tile) {
    const borders = [[], [], [], [], []];
    tile.grid.forEach((value, x, y) => {
        if (x === 0) {
            borders[4].push(value);
        }
        if (x === tile.grid.maxCol) {
            borders[2].push(value);
        }
        if (y === 0) {
            borders[1].push(value);
        }
        if (y === tile.grid.maxRow) {
            borders[3].push(value);
        }
    });
    tile.borders = borders.map((border) => border.join(''));
}

/**
 * @param {Tile} tile
 */
function flipX(tile) {
    const grid = tile.grid;
    const newGrid = new Grid();
    grid.forEach((value, col, row) => {
        newGrid.set(grid.maxCol - col, row, value);
    });
    tile.grid = newGrid;
    getBorders(tile);
}

/**
 * @param {Tile} tile
 */
function flipY(tile) {
    const grid = tile.grid;
    const newGrid = new Grid();
    grid.forEach((value, col, row) => {
        newGrid.set(col, grid.maxRow - row, value);
    });
    tile.grid = newGrid;
    getBorders(tile);
}

/**
 * @param {Tile} tile
 */
function rotate(tile, n = 1) {
    for (let i = 0; i < n; i++) {
        const newGrid = new Grid();
        tile.grid.forEach((value, col, row) => {
            newGrid.set(tile.grid.maxRow - row, col, value);
        });
        tile.grid = newGrid;
    }
    getBorders(tile);
}

/**
 *
 * @param {Tile} tile
 * @param {number} borderId
 * @param {Tile[]} tiles
 */
function findNeighbour(tile, borderId, tiles) {
    const border = tile.borders[borderId];
    const reversed = border.split('').reverse().join('');

    for (const other of tiles) {
        if (other === tile) {
            continue;
        }

        for (let i = 1; i < 5; i++) {
            const otherBorder = other.borders[i];
            if (otherBorder === border) {
                return { neighbourBorder: i, neighbourTile: other };
            } else if (otherBorder === reversed) {
                return { neighbourBorder: -i, neighbourTile: other };
            }
        }
    }
}

/**
 *
 * @param {Tile[]} tiles
 */
function findCorners(tiles) {
    let corners = [];
    for (const tile of tiles) {
        let neighbours = 0;
        let neighbourBorders = [];

        nextTile: for (const other of tiles) {
            if (tile === other) {
                continue;
            }

            for (let i = 1; i < 5; i++) {
                const border = tile.borders[i];
                const reversed = border.split('').reverse().join('');

                for (const otherBorder of other.borders) {
                    if (border === otherBorder || reversed === otherBorder) {
                        neighbours++;
                        neighbourBorders.push(i);
                        continue nextTile;
                    }
                }
            }
        }

        if (neighbours === 2) {
            corners.push({ tile, neighbourBorders });
        }
    }
    return corners;
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
