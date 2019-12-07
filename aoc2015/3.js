const fs = require('fs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch(e) {}
const testInput = `
^v^v^v^v^v
`
.trim()
.replace(/, /g, '\n');


function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter(line => line.length);


    let x = 0;
    let y = 0;
    function coord(x, y) {
        return x + '_' + y;
    }
    let locations = new Set();
    locations.add(coord(0, 0));
    lines[0].split('').forEach((char, ix) => {
        if (char === '^') {
            x += 1;
        } else if (char === 'v') {
            x -= 1;
        } else if (char === '>') {
            y += 1;
        } else if (char === '<') {
            y -= 1;
        } else {
            console.error(char);
        }

        locations.add(coord(x, y));
    });
    part1 = locations.size;

    locations.clear();
    locations.add(coord(0, 0));
    const positions = [{ x: 0, y: 0}, { x: 0, y: 0}];
    let index = 0;
    lines[0].split('').forEach((char, ix) => {
        const position = positions[index];
        if (char === '^') {
            position.x += 1;
        } else if (char === 'v') {
            position.x -= 1;
        } else if (char === '>') {
            position.y += 1;
        } else if (char === '<') {
            position.y -= 1;
        }
        locations.add(coord(position.x, position.y));
        index = (index + 1) & 1
    });
    part2 = locations.size;

    return [part1, part2];
}

const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));
