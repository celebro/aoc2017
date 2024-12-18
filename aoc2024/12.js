const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');
const { type } = require('os');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
AAAA
BBCD
BBCC
EEEC
`,
    `
OOOOO
OXOXO
OOOOO
OXOXO
OOOOO
`,
    `
EEEEE
EXXXX
EEEEE
EXXXX
EEEEE
`,
    `
AAAAAA
AAABBA
AAABBA
ABBAAA
ABBAAA
AAAAAA
`,
    `
RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE
`
].map((x) => x.trim());

const neighbours = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
];

const right = 0;
const left = 1;
const down = 2;
const up = 3;

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = 0;
    let lines = readInput(input);

    let grid = new Grid();
    for (let y = 0; y < lines.length; y++) {
        let line = lines[y];
        for (let x = 0; x < line.length; x++) {
            grid.set(x, y, { x, y, type: line[x], visited: false, processed: false, sides: [0, 0, 0, 0], nsides: [0, 0, 0, 0] });
        }
    }

    let areaId = 0;
    grid.forEach((cell) => {
        if (cell.visited) {
            return;
        }

        areaId++;

        let area = 0;
        let perimeter = 0;
        // let sides = 0;

        let list = [cell];
        cell.visited = true;

        for (let i = 0; i < list.length; i++) {
            let node = list[i];
            area++;
            node.areaId = areaId;

            for (let side = 0; side < neighbours.length; side++) {
                let [dx, dy] = neighbours[side];
                let next = grid.get(node.x + dx, node.y + dy);

                if (!next || next.type !== node.type) {
                    perimeter++;

                    node.sides[side] = 1;
                } else if (!next.visited) {
                    next.visited = true;
                    list.push(next);
                } else {
                    // for (let nside = 0; nside < 4; nside++) {
                    //     node.nsides[nside] += next.sides[nside];
                    // }
                }
            }

            //
            // for (let side = 0; side < 4; side++) {
            //     if (node.sides[side] === 1 && node.nsides[side] === 0) {
            //         sides++;
            //     }
            // }
        }

        part1 += area * perimeter;
        // part2 += area * sides;
    });

    function getNeighborInArea(node, dir) {
        let [dx, dy] = neighbours[dir];
        let next = grid.get(node.x + dx, node.y + dy);
        if (!next) {
            return null;
        }
        if (next.areaId !== node.areaId) {
            return null;
        }
        return next;
    }

    let areas = [];
    grid.forEach((node) => {
        let area = areas[node.areaId] || { size: 0, sides: 0, type: node.type };
        areas[node.areaId] = area;

        area.size++;

        let upNeighbour = getNeighborInArea(node, up);
        let leftNeighbour = getNeighborInArea(node, left);

        if (!upNeighbour?.sides[right]) {
            area.sides += node.sides[right];
        }
        if (!upNeighbour?.sides[left]) {
            area.sides += node.sides[left];
        }
        if (!leftNeighbour?.sides[down]) {
            area.sides += node.sides[down];
        }
        if (!leftNeighbour?.sides[up]) {
            area.sides += node.sides[up];
        }
    });

    areas.forEach((area) => {
        part2 += area.size * area.sides;
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

// 862606 too high
