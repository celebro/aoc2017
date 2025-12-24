const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3
`
].map((x) => x.trim());

`
..............
.......#XXX#..
.......X...X..
..#XXXX#...X..
..X........X..
..#XXXXXXXX#..
..............
..............
..............
`;
// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = 0;
    let lines = readInput(input);

    let tiles = [];
    let vectors = [];

    for (let lineIx = 0; lineIx < lines.length; lineIx++) {
        let line = lines[lineIx];
        let [x, y] = sscanf(line, '%d,%d');
        let tile = { x, y };
        if (tiles.length > 0) {
            vectors.push([tiles.at(-1), tile]);
        }
        tiles.push(tile);
    }
    vectors.push([tiles.at(-1), tiles[0]]);

    for (let i = 0; i < tiles.length - 1; i++) {
        let t1 = tiles[i];
        for (let j = i + 1; j < tiles.length; j++) {
            let t2 = tiles[j];
            let dx = Math.abs(t1.x - t2.x) + 1;
            let dy = Math.abs(t1.y - t2.y) + 1;
            let area = dx * dy;
            part1 = Math.max(part1, area);

            //
            let ok = isIn(t1.x, t2.y) && isIn(t2.x, t1.y) && isIn(Math.round((t1.x + t2.x) / 2), Math.round((t1.y + t2.y) / 2));

            // cut outs
            ok = ok && !crosses(t1, t2);

            if (ok) {
                // debugger;
                part2 = Math.max(part2, area);
            }
        }
    }

    function isIn(x, y) {
        // count crossings from x,y to right (->)
        let crossings = 0;

        if (x === 2 && y === 1) {
            // debugger;
        }

        for (let v of vectors) {
            let x1 = Math.min(v[0].x, v[1].x);
            let y1 = Math.min(v[0].y, v[1].y);
            let x2 = Math.max(v[0].x, v[1].x);
            let y2 = Math.max(v[0].y, v[1].y);

            if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {
                // on the vector, counts as in
                return true;
            }

            if (x1 > x && x2 > x) {
                // only right of the point matters
                if (y1 === y2) {
                    // horizontal line to right
                    // if (y === y1) {
                    //     crossings--;
                    // }
                } else if (x1 === x2) {
                    // vertical line
                    if (y >= y1 && y < y2) {
                        crossings++;
                    }
                } else {
                    // unreachable
                }
            }
        }
        // 4650952673 too high
        // 4598853740 too high
        return crossings % 2 === 1;
    }

    function crosses(t1, t2) {
        let minx = Math.min(t1.x, t2.x);
        let maxx = Math.max(t1.x, t2.x);
        let miny = Math.min(t1.y, t2.y);
        let maxy = Math.max(t1.y, t2.y);

        for (let v of vectors) {
            let { x, y } = v[0];

            if (x === v[1].x) {
                // vertical vector
                if (x > minx && x < maxx) {
                    // within x bounds

                    let vymin = Math.min(v[0].y, v[1].y);
                    let vymax = Math.max(v[0].y, v[1].y);

                    if (vymin < t1.y && vymax > t1.y) {
                        return true;
                    }
                    if (vymin < t2.y && vymax > t2.y) {
                        return true;
                    }
                }
            } else {
                // horizontal vector
                if (y > miny && y < maxy) {
                    // within y bounds

                    let vxmin = Math.min(v[0].x, v[1].x);
                    let vxmax = Math.max(v[0].x, v[1].x);

                    if (vxmin < t1.x && vxmax > t1.x) {
                        return true;
                    }
                    if (vxmin < t2.x && vxmax > t2.x) {
                        return true;
                    }
                }
            }
        }
        return false;
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
