const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');
const gcd = require('../utils/gcd');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
19, 13, 30 @ -2,  1, -2
18, 19, 22 @ -1, -1, -2
20, 25, 34 @ -2, -2, -4
12, 31, 28 @ -1, -2, -1
20, 19, 15 @  1, -5, -3
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input, min, max) {
    let part1 = 0;
    let part2 = undefined;
    const lines = input.split('\n').filter((line) => line.length);

    const hail = [];
    lines.forEach((line) => {
        const [x, y, z, x1, y1, z1] = sscanf(line, '%d, %d, %d @ %d, %d, %d');
        const h = {
            pos: { x, y, z },
            v: { x: x1, y: y1, z: z1 },
            k: 0,
            a: 0,
            b: -1,
            c: 0
        };

        h.k = y1 / x1;
        h.c = y - h.k * x;
        h.a = h.k;

        hail.push(h);
    });

    for (let i = 1; i < hail.length; i++) {
        for (let j = 0; j < i; j++) {
            if (intersection(hail[i], hail[j], min, max)) {
                part1++;
            }
        }
    }

    all: for (let vx = -500; vx <= 500; vx++) {
        for (let vy = -500; vy <= 500; vy++) {
            let rock = undefined;

            const h1 = hail[0];

            hail: for (let i = 1; i < hail.length; i++) {
                const h2 = hail[i];

                const inter = intersection(h1, h2, vx, vy, undefined, undefined, i);
                if (inter === true) {
                    continue;
                }
                if (!rock && inter) {
                    rock = inter;
                }
                if (!inter || Math.abs(rock.x - inter.x) > 0.9 || Math.abs(rock.y - inter.y) > 0.9) {
                    rock = undefined;
                    break hail;
                }
            }

            if (rock) {
                const pos = { x: Math.round(rock.x), y: Math.round(rock.y), z: 0 };
                const vec = { x: -vx, y: -vy, z: 0 };

                const h2 = hail[1];

                const t1 = (pos.x - h1.pos.x) / (h1.v.x - vec.x);
                const t2 = (pos.y - h2.pos.y) / (h2.v.y - vec.y);

                const z1 = h1.pos.z + t1 * h1.v.z;
                const z2 = h2.pos.z + t2 * h2.v.z;
                vec.z = (z2 - z1) / (t2 - t1);
                pos.z = h1.pos.z + t1 * h1.v.z - t1 * vec.z;

                part2 = pos.x + pos.y + pos.z;

                break all;
            }
        }
    }

    function intersection(h1, h2, dvx = 0, dvy = 0, min, max, i) {
        updateParams(h1, dvx, dvy);
        updateParams(h2, dvx, dvy);

        const a1 = h1.a;
        const b1 = h1.b;
        const c1 = h1.c;
        const a2 = h2.a;
        const b2 = h2.b;
        const c2 = h2.c;
        let x = (b1 * c2 - b2 * c1) / (a1 * b2 - a2 * b1);
        let y = (c1 * a2 - c2 * a1) / (a1 * b2 - a2 * b1);

        // vertical lines
        if (Math.abs(h1.k) === Infinity && Math.abs(h2.k) === Infinity) {
            if (h1.pos.x !== h2.pos.x) {
                return undefined;
            }
            return true;
        }
        if (Math.abs(h1.k) === Infinity) {
            x = h1.pos.x;
            y = h2.k * x + h2.c;
        }
        if (Math.abs(h2.k) === Infinity) {
            x = h2.pos.x;
            y = h1.k * x + h1.c;
        }
        // just one point
        if (isNaN(h1.k)) {
            x = h1.pos.x;
            y = h1.pos.y;
            if (Math.abs(y - h2.k * x + h2.c) > 0.001) {
                return undefined;
            }
        }
        if (isNaN(h2.k)) {
            x = h2.pos.x;
            y = h2.pos.y;
            if (Math.abs(y - h1.k * x + h1.c) > 0.001) {
                return undefined;
            }
        }
        // identical line
        if (a1 === a2 && c1 === c2) {
            return true;
        }

        if (min && max) {
            if (min <= x && x <= max && min <= y && y <= max && sameSign(x - h1.pos.x, h1.v.x + dvx) && sameSign(x - h2.pos.x, h2.v.x + dvx)) {
                return { x, y };
            }
        } else {
            if (sameSign(x - h1.pos.x, h1.v.x + dvx) && sameSign(x - h2.pos.x, h2.v.x + dvx)) {
                return { x, y };
            }
        }

        return undefined;
    }

    function updateParams(h, dvx, dvy) {
        h.k = (h.v.y + dvy) / (h.v.x + dvx);
        h.c = h.pos.y - h.k * h.pos.x;
        h.a = h.k;
    }

    return [part1, part2];
}

function sameSign(a, b) {
    return (a > 0 && b > 0) || (a < 0 && b < 0);
}
// for (const testInput of testInputs) {
//     if (testInput) {
//         const testResult = run(testInput, 7, 27);
//         console.log('test: ', testResult.join(' / '));
//     }
// }

const result = run(input, 200000000000000, 400000000000000);
console.log('result: ', result.join(' / '));
