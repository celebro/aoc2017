const fs = require('fs');
const sscanf = require('scan.js').scan;
// @ts-ignore
const Grid = require('../utils/Grid');
// @ts-ignore
const List = require('../utils/ArrayQueue');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8');
} catch (e) {}
const testInputs = [
    `
         A
         A
  #######.#########
  #######.........#
  #######.#######.#
  #######.#######.#
  #######.#######.#
  #####  B    ###.#
BC...##  C    ###.#
  ##.##       ###.#
  ##...DE  F  ###.#
  #####    G  ###.#
  #########.#####.#
DE..#######...###.#
  #.#########.###.#
FG..#########.....#
  ###########.#####
             Z
             Z
`,
    //     `
    //                    A
    //                    A
    //   #################.#############
    //   #.#...#...................#.#.#
    //   #.#.#.###.###.###.#########.#.#
    //   #.#.#.......#...#.....#.#.#...#
    //   #.#########.###.#####.#.#.###.#
    //   #.............#.#.....#.......#
    //   ###.###########.###.#####.#.#.#
    //   #.....#        A   C    #.#.#.#
    //   #######        S   P    #####.#
    //   #.#...#                 #......VT
    //   #.#.#.#                 #.#####
    //   #...#.#               YN....#.#
    //   #.###.#                 #####.#
    // DI....#.#                 #.....#
    //   #####.#                 #.###.#
    // ZZ......#               QG....#..AS
    //   ###.###                 #######
    // JO..#.#.#                 #.....#
    //   #.#.#.#                 ###.#.#
    //   #...#..DI             BU....#..LF
    //   #####.#                 #.#####
    // YN......#               VT..#....QG
    //   #.###.#                 #.###.#
    //   #.#...#                 #.....#
    //   ###.###    J L     J    #.#.###
    //   #.....#    O F     P    #.#...#
    //   #.###.#####.#.#####.#####.###.#
    //   #...#.#.#...#.....#.....#.#...#
    //   #.#####.###.###.#.#.#########.#
    //   #...#.#.....#...#.#.#.#.....#.#
    //   #.###.#####.###.###.#.#.#######
    //   #.#.........#...#.............#
    //   #########.###.###.#############
    //            B   J   C
    //            U   P   P
    // `
    `
             Z L X W       C
             Z P Q B       K
  ###########.#.#.#.#######.###############
  #...#.......#.#.......#.#.......#.#.#...#
  ###.#.#.#.#.#.#.#.###.#.#.#######.#.#.###
  #.#...#.#.#...#.#.#...#...#...#.#.......#
  #.###.#######.###.###.#.###.###.#.#######
  #...#.......#.#...#...#.............#...#
  #.#########.#######.#.#######.#######.###
  #...#.#    F       R I       Z    #.#.#.#
  #.###.#    D       E C       H    #.#.#.#
  #.#...#                           #...#.#
  #.###.#                           #.###.#
  #.#....OA                       WB..#.#..ZH
  #.###.#                           #.#.#.#
CJ......#                           #.....#
  #######                           #######
  #.#....CK                         #......IC
  #.###.#                           #.###.#
  #.....#                           #...#.#
  ###.###                           #.#.#.#
XF....#.#                         RF..#.#.#
  #####.#                           #######
  #......CJ                       NM..#...#
  ###.#.#                           #.###.#
RE....#.#                           #......RF
  ###.###        X   X       L      #.#.#.#
  #.....#        F   Q       P      #.#.#.#
  ###.###########.###.#######.#########.###
  #.....#...#.....#.......#...#.....#.#...#
  #####.#.###.#######.#######.###.###.#.#.#
  #.......#.......#.#.#.#.#...#...#...#.#.#
  #####.###.#####.#.#.#.#.###.###.#.###.###
  #.......#.....#.#...#...............#...#
  #############.#.#.###.###################
               A O F   N
               A A D   M
`
];

const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input, isPart2) {
    let part1 = undefined;
    let part2 = undefined;

    /**
     * @typedef {Object} Location
     * @property {number} x
     * @property {number} y
     * @property {string} type
     * @property {string} label
     * @property {Location} portal
     * @property {number[]} steps
     * @property {boolean} outer
     */
    /** @type {Grid<Location>} */
    const grid = new Grid();

    const lines = input.split('\n').filter(line => line.length);
    lines.forEach((line, y) => {
        line.split('').forEach((char, x) => {
            const location = {
                x,
                y,
                type: char,
                label: null,
                portal: null,
                steps: [],
                outer: false
            };
            grid.set(x, y, location);
        });
    });

    function isLetter(char) {
        return char >= 'A' && char <= 'Z';
    }

    // grid.print(x => x.type);

    /** @type {Location} */
    let start = null;

    const labelMap = {};
    grid.forEach((location, x, y) => {
        if (!location) return;
        const letter = location.type;
        if (isLetter(letter)) {
            for (const [dx, dy] of neighbours) {
                const neighbour = grid.get(x + dx, y + dy);
                if (!neighbour || neighbour.type !== '.') continue;

                const otherLetter = grid.get(x - dx, y - dy).type;
                const label = dx + dy > 0 ? otherLetter + letter : letter + otherLetter;

                neighbour.label = label;
                if (neighbour.x < 3 || grid.maxCol - neighbour.x < 3 || neighbour.y < 3 || grid.maxRow - neighbour.y < 3) {
                    neighbour.outer = true;
                }

                if (labelMap[label]) {
                    neighbour.portal = labelMap[label];
                    neighbour.portal.portal = neighbour;
                } else {
                    labelMap[label] = neighbour;
                }

                if (label == 'AA') {
                    start = neighbour;
                }
            }
        }
    });

    /** @type {List<{ node: Location, level: number}>} */
    const list = new List();
    list.enq({ node: start, level: 0 });
    // @ts-ignore
    start.steps = [0];

    while (!list.isEmpty()) {
        const { node, level } = list.deq();
        if (node.label === 'ZZ' && level === 0) {
            part1 = node.steps[0];
            break;
        }
        for (const [dx, dy] of neighbours) {
            const next = grid.get(node.x + dx, node.y + dy);
            if (!next || next.type !== '.' || next.steps[level] !== undefined) continue;

            next.steps[level] = node.steps[level] + 1;
            list.enq({ node: next, level: level });
        }
        if (node.portal) {
            if (!isPart2 && node.portal.steps.length === 0) {
                node.portal.steps[0] = node.steps[0] + 1;
                list.enq({ node: node.portal, level: level });
            }
            if (isPart2) {
                const nextLevel = node.outer ? level - 1 : level + 1;
                if (nextLevel >= 0) {
                    node.portal.steps[nextLevel] = node.steps[level] + 1;
                    list.enq({ node: node.portal, level: nextLevel });
                }
            }
        }
    }

    return [part1, part2];
}

for (const testInput of testInputs) {
    const testResult = run(testInput, true);
    console.log('test: ', testResult.join(' / '));
}

console.time('p2');
const result = run(input, true);
console.timeEnd('p2');
console.log('result: ', result.join(' / '));
