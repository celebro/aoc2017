const fs = require('fs');

const input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInput = `
eedadn
drvtee
eandsr
raavrd
atevrs
tsrnev
sdttsa
rasrtv
nssdts
ntnada
svetve
tesnvt
vntsnd
vrdear
dvrsen
enarar
`.trim();

function run(input) {
    let part1 = 0;
    let part2 = 0;

    const positions = [];
    input
        .split('\n')
        .filter(line => line.length)
        .forEach(line => {
            line.split('').forEach((char, ix) => {
                let pos = positions[ix];
                if (!pos) {
                    pos = positions[ix] = {};
                }
                pos[char] = (pos[char] || 0) + 1;
            })
        });

    part1 = positions.map(pos => {
        return Object.keys(pos).sort((a, b) => pos[b] - pos[a])[0]
    }).join('');

    part2 = positions.map(pos => {
        return Object.keys(pos).sort((a, b) => pos[a] - pos[b])[0]
    }).join('');

    return [part1, part2];
}

const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));
