const fs = require('fs');
const sscanf = require('scan.js').scan;
// @ts-ignore
const gcd = require('../utils/gcd');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}

const testInputs = [
    `
<x=-8, y=-10, z=0>
<x=5, y=5, z=10>
<x=2, y=-7, z=3>
<x=9, y=-8, z=-3>
`,
    `
<x=-1, y=0, z=2>
<x=2, y=-10, z=-7>
<x=4, y=-8, z=8>
<x=3, y=5, z=-1>`
].map(x => x.trim());

/**
 * @param {string} input
 */
function run(input, steps) {
    let part1 = 0;
    let part2 = undefined;
    const lines = input.split('\n').filter(line => line.length);

    const moons = [];
    lines.forEach((line, ix) => {
        const [x, y, z] = sscanf(line, '<x=%d, y=%d, z=%d>');
        moons.push({ x, y, z, dx: 0, dy: 0, dz: 0 });
    });

    const initialPositions = {
        x: moons.map(moon => moon.x).join(','),
        y: moons.map(moon => moon.y).join(','),
        z: moons.map(moon => moon.z).join(',')
    };

    function step(dir) {
        const vel = 'd' + dir;
        for (let i = 0; i < moons.length; i++) {
            const a = moons[i];
            for (let j = i + 1; j < moons.length; j++) {
                const b = moons[j];
                if (a[dir] < b[dir]) {
                    a[vel] += 1;
                    b[vel] -= 1;
                } else if (a[dir] > b[dir]) {
                    a[vel] -= 1;
                    b[vel] += 1;
                }
            }
            a[dir] += a[vel];
        }
    }

    for (let iter = 0; iter < steps; iter++) {
        step('x');
        step('y');
        step('z');
    }
    for (const moon of moons) {
        const pot = Math.abs(moon.x) + Math.abs(moon.y) + Math.abs(moon.z);
        const kin = Math.abs(moon.dx) + Math.abs(moon.dy) + Math.abs(moon.dz);
        part1 += pot * kin;
    }

    // Part2
    const dirRepeat = {};

    for (const dir of ['x', 'y', 'z']) {
        const vel = 'd' + dir;
        let iterations = steps;
        const initialPosition = initialPositions[dir];
        while (true) {
            iterations++;
            step(dir);
            let stationary = true;
            for (let moon of moons) {
                if (moon[vel] !== 0) {
                    stationary = false;
                    break;
                }
            }

            if (stationary && moons.map(x => x[dir]).join(',') === initialPosition) {
                dirRepeat[dir] = iterations;
                break;
            }
        }
    }

    console.log(dirRepeat);
    const { x, y, z } = dirRepeat;
    let divisor = gcd(x, y);
    const a = (x / divisor) * y;
    divisor = gcd(a, z);
    part2 = (a / divisor) * z;

    return [part1, part2];
}

testInputs.forEach(testInput => {
    const testResult = run(testInput, 10);
    console.log('test: ', testResult.join(' / '));
});

const result = run(input, 1000);
console.log('result: ', result.join(' / '));
