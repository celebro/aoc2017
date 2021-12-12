const fs = require('fs');
const Grid = require('../utils/Grid');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
2199943210
3987894921
9856789892
8767896789
9899965678
`
].map((x) => x.trim());

const neighbours = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = undefined;
    const lines = input.split('\n').filter((line) => line.length);

    const map = new Grid();

    lines.forEach((line, y) => {
        line.split('').forEach((char, x) => {
            map.set(x, y, { height: +char, visited: false, x, y });
        });
    });

    /** @type {{ x: number, y: number, basinSize: number }[]} */
    const lowPoints = [];

    map.forEach(({ height }, x, y) => {
        let isLow = true;

        for (const [dx, dy] of neighbours) {
            const xx = x + dx;
            const yy = y + dy;
            if (xx >= 0 && yy >= 0 && xx <= map.maxCol && yy <= map.maxRow) {
                if (height >= map.get(xx, yy).height) {
                    isLow = false;
                }
            }
        }

        if (isLow) {
            part1 += 1 + height;
            lowPoints.push({ x, y, basinSize: 0 });
        }
    });

    for (const lowPoint of lowPoints) {
        const locations = [map.get(lowPoint.x, lowPoint.y)];

        while (locations.length) {
            const location = locations.shift();
            location.visited = true;
            lowPoint.basinSize++;

            for (const [dx, dy] of neighbours) {
                const neighbour = map.get(location.x + dx, location.y + dy);
                if (!neighbour || neighbour.visited || neighbour.height === 9) {
                    continue;
                }
                neighbour.visited = true;
                locations.push(neighbour);
            }
        }
    }

    lowPoints.sort((a, b) => b.basinSize - a.basinSize);
    part2 = lowPoints[0].basinSize * lowPoints[1].basinSize * lowPoints[2].basinSize;

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
