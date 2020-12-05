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
Butterscotch: capacity -1, durability -2, flavor 6, texture 3, calories 8
Cinnamon: capacity 2, durability 3, flavor -2, texture -1, calories 3
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

    const items = [];

    lines.forEach((line, ix) => {
        const [name, capacity, durability, flavor, texture, calories] = sscanf(
            line,
            '%s capacity %d, durability %d, flavor %d, texture %d, calories %d'
        );
        items.push({ name: name.slice(0, -1), capacity, durability, flavor, texture, calories });
    });

    const selected = items.map((x) => 0);
    let best = 0;
    let best2 = 0;

    function r(pos, total) {
        if (pos === selected.length - 1) {
            selected[pos] = 100 - total;

            const properties = ['capacity', 'durability', 'flavor', 'texture'];

            let product = 1;
            for (const property of properties) {
                let propertySum = 0;
                for (let i = 0; i < items.length; i++) {
                    propertySum += items[i][property] * selected[i];
                }

                if (propertySum > 0) {
                    product = product * propertySum;
                } else {
                    product = 0;
                }
            }

            if (product > best) {
                best = product;
            }

            let calories = 0;
            for (let i = 0; i < items.length; i++) {
                calories += items[i].calories * selected[i];
            }
            if (calories === 500 && product > best2) {
                best2 = product;
            }
        } else {
            for (let i = 0; i < 100 - total; i++) {
                selected[pos] = i;
                r(pos + 1, total + i);
            }
        }
    }
    r(0, 0);

    part1 = best;
    part2 = best2;

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
