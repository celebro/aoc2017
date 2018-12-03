const fs = require('fs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch(e) {}
const testInput = `
abcdef
bababc
abbcde
abcccd
aabcdd
abcdee
ababab
`
.trim()
.replace(/, /g, '\n');


function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter(line => line.length);

    let n2 = 0;
    let n3 = 0;
    lines.forEach((line, ix) => {
        let counts = {};
        line.split('').forEach(char => {
            counts[char] = (counts[char] || 0) + 1;
        });

        const lookup = new Set(Object.values(counts));
        if (lookup.has(2)) {
            n2 += 1;
        }
        if (lookup.has(3)) {
            n3 += 1;
        }
    });
    part1 = n2 * n3;

    const set = new Set();
    for (const line of lines) {
        for (let i = 0; i < line.length; i++) {
            let subline = line.substring(0, i) + '_' + line.substring(i + 1);
            if (set.has(subline)) {
                part2 = subline.replace('_', '');
            }
            set.add(subline);
        }
    };

    return [part1, part2];
}

const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));
