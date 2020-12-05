const fs = require('fs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = 0;
    const lines = input.split('\n').filter((line) => line.length);

    const target = {
        children: 3,
        cats: 7,
        samoyeds: 2,
        pomeranians: 3,
        akitas: 0,
        vizslas: 0,
        goldfish: 5,
        trees: 3,
        cars: 2,
        perfumes: 1
    };

    lines.forEach((line) => {
        const parts = line.split(': ');
        const id = +parts[0].split(' ')[1];
        parts.shift();

        let valid1 = true;
        let valid2 = true;

        for (const part3 of parts.join(' ').split(', ')) {
            const [thing, valueStr] = part3.split(' ');
            const value = +valueStr;

            if (target[thing] !== value) {
                valid1 = false;
            }

            if (thing === 'cats' || thing === 'trees') {
                if (target[thing] >= value) {
                    valid2 = false;
                }
            } else if (thing === 'pomeranians' || thing === 'goldfish') {
                if (target[thing] <= value) {
                    valid2 = false;
                }
            } else if (target[thing] !== value) {
                valid2 = false;
            }
        }

        if (valid1) {
            part1 = id;
        }

        if (valid2) {
            part2 = id;
        }
    });

    return [part1, part2];
}

const result = run(input);
console.log('result: ', result.join(' / '));
