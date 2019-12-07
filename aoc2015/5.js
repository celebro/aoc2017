const fs = require('fs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch(e) {}
const testInput = `
qjhvhtzxzqqjkmpb
uurcxstgmygtbstg
ieodomkazucvgmuy
`
.trim()
.replace(/, /g, '\n');


const vovels = new Set('aeiou'.split(''));
function run(input) {
    let part1 = 0;
    let part2 = 0;
    const lines = input.split('\n').filter(line => line.length);

    lines.forEach((line, ix) => {
        let numVovels = 0;
        let repeats = false;
        let blackList = false;

        let last;
        for (const char of line) {
            if (vovels.has(char)) {
                numVovels++;
            }
            if (char === last) {
                repeats = true;
            }
            last = char;
        }
        if (line.match(/ab|cd|pq|xy/)) {
            blackList = true;
        }

        if (numVovels >= 3 && repeats && !blackList) {
            part1 += 1;
        }
    });

    lines.forEach((line, ix) => {
        const chars = line.split('');
        let cond1 = false;
        let cond2 = false;

        chars.forEach((char, ix) => {
            if (ix > 0) {
                const repeat = chars[ix - 1] + char;
                if (line.indexOf(repeat, ix + 1) !== -1) {
                    cond1 = true;
                }

                if (chars[ix - 1] === chars[ix + 1]) {
                    cond2 = true;
                }
            }
        });

        if (cond1 && cond2) {
            part2 += 1;
        }
    });

    return [part1, part2];
}

const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));
