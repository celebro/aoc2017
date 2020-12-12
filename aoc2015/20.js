const fs = require('fs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `

`
].map((x) => x.trim());

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const num = +input.split('\n').filter((line) => line.length)[0];

    let list = [null, { sum: 0, elfs: [] }];
    let ix = 1;

    function getHouse(i) {
        if (!list[i]) {
            list[i] = { sum: 0, elfs: [] };
        }
        return list[i];
    }

    while (true) {
        const house = getHouse(ix);
        house.sum += ix * 10;
        house.elfs.push(ix);

        if (house.sum >= num) {
            part1 = ix;
            break;
        }

        for (const elf of house.elfs) {
            const nextIx = ix + elf;
            const nextHouse = getHouse(nextIx);
            nextHouse.sum += 10 * elf;
            nextHouse.elfs.push(elf);
        }

        ix++;
    }

    list = [null, { sum: 0, elfs: [] }];
    ix = 1;

    while (true) {
        const house = getHouse(ix);
        house.sum += ix * 11;
        house.elfs.push({ ix, houses: 1 });

        if (house.sum >= num) {
            part2 = ix;
            break;
        }

        for (const elf of house.elfs) {
            const nextIx = ix + elf.ix;
            const nextHouse = getHouse(nextIx);
            nextHouse.sum += 11 * elf.ix;
            elf.houses += 1;
            if (elf.houses !== 50) {
                nextHouse.elfs.push(elf);
            }
        }

        ix++;
    }

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
