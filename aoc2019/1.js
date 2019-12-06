const fs = require('fs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch(e) {
    console.error('failed to read file', e);
}
const testInput = `

`
.trim();

console.log(input);
function run(input) {
    let part1 = 0;
    let part2 = 0;
    const lines = input.split('\n').filter(line => line.length);
    console.log(lines);

    function getTotalFuel(mass) {
        let fuel = Math.floor(mass / 3) - 2;
        if (fuel < 0) {
            return 0;
        } else {
            return fuel + getTotalFuel(fuel);
        }
    }

    lines.forEach((line, ix) => {
        const mass = +line;
        const fuel = Math.floor(mass / 3) - 2;
        part1 = part1 + fuel;
        part2 = part2 + getTotalFuel(mass);
    });

    return [part1, part2];
}

const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));
