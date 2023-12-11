const fs = require('fs');
const sscanf = require('scan.js').scan;

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
`
].map((x) => x.trim());

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = 0;
    const lines = input.split('\n').filter((line) => line.length);

    const limits = {
        red: 12,
        green: 13,
        blue: 14
    };
    lines.forEach((line) => {
        const [idstr, drawstr] = line.split(':');
        const [id] = sscanf(idstr, 'Game %d');

        const mins = {
            red: 0,
            green: 0,
            blue: 0
        };

        let possible = true;
        for (const draw of drawstr.trim().split(';')) {
            for (const colordraw of draw.trim().split(', ')) {
                const [num, color] = sscanf(colordraw, '%d %s');
                const limit = limits[color];
                if (num > limit) {
                    possible = false;
                }

                mins[color] = Math.max(mins[color], num);
            }
        }
        if (possible) {
            part1 += id;
        }

        const power = mins.red * mins.green * mins.blue;
        part2 += power;
    });

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
// 3215 too high
