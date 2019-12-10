const fs = require('fs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
.#....#####...#..
##...##.#####..##
##...#...#.#####.
..#.....#...###..
..#.#.....#....##
    `,
    `
.#..#
.....
#####
....#
...##
    `,
    `
......#.#.
#..#.#....
..#######.
.#.#.###..
.#..#.....
..#....#.#
#..#....#.
.##.#..###
##...#..#.
.#....####
    `,
    `
#.#...#.#.
.###....#.
.#....#...
##.#.#.#.#
....#.#.#.
.##..###.#
..#...##..
..##....##
......#...
.####.###.
    `,
    `
.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##
    `
].map(x => x.trim());

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter(line => line.length);

    /**
     * @typedef {Object} Asteroid
     * @property {number} x
     * @property {number} y
     * @property {number} visible
     */
    /**
     * @type Asteroid[]
     */
    const asteroids = [];
    lines.forEach((line, y) => {
        line.split('').forEach((position, x) => {
            if (position === '#') {
                asteroids.push({ x, y, visible: 0 });
            }
        });
    });

    for (let i = 0; i < asteroids.length; i++) {
        const a = asteroids[i];
        const slopes = new Set();
        for (let j = i + 1; j < asteroids.length; j++) {
            const b = asteroids[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const k = dy / dx;
            if (!slopes.has(k)) {
                slopes.add(k);
                a.visible += 1;
                b.visible += 1;
            }
        }
    }

    let maxAsteroid;
    for (const a of asteroids) {
        if (!maxAsteroid || a.visible > maxAsteroid.visible) {
            maxAsteroid = a;
        }
    }

    part1 = maxAsteroid.visible;

    // part 2
    let directions = new Map();
    for (const a of asteroids) {
        if (a === maxAsteroid) {
            continue;
        }
        const dx = a.x - maxAsteroid.x;
        const dy = a.y - maxAsteroid.y;
        const k = dy / dx;
        const half = dx >= 0 ? 0 : 1;
        const key = half + ':' + k;

        let direction = directions.get(key);
        if (!direction) {
            direction = { half, k, asteroids: [a] };
            directions.set(key, direction);
        } else {
            if (dy < 0 || (dy === 0 && dx < 0)) {
                direction.asteroids.push(a);
            } else {
                direction.asteroids.unshift(a);
            }
        }
    }

    const shootingOrder = [...directions.values()];
    shootingOrder.sort((a, b) => {
        let diff = a.half - b.half;
        if (diff === 0) {
            diff = a.k - b.k;
        }
        return diff;
    });

    let i = 0;
    let count = 0;
    let asteroid200;
    while (shootingOrder.length > 0) {
        const direction = shootingOrder[i];
        const killed = direction.asteroids.pop();
        count += 1;
        if (count === 200) {
            asteroid200 = killed;
            break;
        }

        if (direction.asteroids.length === 0) {
            shootingOrder.splice(i, 1);
            i = i % shootingOrder.length;
        } else {
            i = (i + 1) % shootingOrder.length;
        }
    }

    if (asteroid200) {
        part2 = asteroid200.x * 100 + asteroid200.y;
    }
    return [part1, part2];
}

testInputs.forEach(input => {
    const testResult = run(input);
    console.log('test: ', testResult.join(' / '));
});

const result = run(input);
console.log('result: ', result.join(' / '));
