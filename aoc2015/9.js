const fs = require('fs');
const sscanf = require('scan.js').scan;

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
London to Dublin = 464
London to Belfast = 518
Dublin to Belfast = 141
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter((line) => line.length);

    const distances = new Map();
    const cities = new Set();

    lines.forEach((line) => {
        const [a, b, distance] = sscanf(line, '%s to %s = %d');
        distances.set(a + b, distance);
        distances.set(b + a, distance);
        cities.add(a);
        cities.add(b);
    });

    const path = [...cities.values()];

    function swap(a, b) {
        const tmp = path[b];
        path[b] = path[a];
        path[a] = tmp;
    }

    function r(pos) {
        let best = Infinity;
        let worst = 0;

        if (pos === path.length - 1) {
            // console.log(path);
            worst = best = distances.get(path[pos] + path[pos - 1]);
        } else {
            for (let i = pos; i < path.length; i++) {
                swap(pos, i);
                const distance = pos === 0 ? 0 : distances.get(path[pos] + path[pos - 1]);
                let remaining = r(pos + 1);
                if (remaining[0] + distance < best) {
                    best = remaining[0] + distance;
                }
                if (remaining[1] + distance > worst) {
                    worst = remaining[1] + distance;
                }
                swap(pos, i);
            }
        }
        return [best, worst];
    }

    [part1, part2] = r(0);

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
