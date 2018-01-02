const fs = require('fs');

const input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInput = `
abba[mnop]qrst
abcd[bddb]xyyx
aaaa[qwer]tyui
ioxxoj[asdfgh]zxcvbn

aba[bab]xyz
xyx[xyx]xyx
aaa[kek]eke
zazbz[bzb]cdb
`.trim();

function run(input) {
    let part1 = 0;
    let part2 = 0;

    function isValidPart1(line) {
        const chars = line.split('');
        let bracket = false;
        let valid = 0;

        chars.forEach((char, ix, line) => {
            if (char === '[') {
                bracket = true;
            } if (char === ']') {
                bracket = false;
            } else if (ix >= 3 && char === line[ix - 3] && line[ix - 1] === line[ix - 2] && char !== line[ix - 1]) {
                if (bracket) {
                    valid = 2;
                } else if (valid === 0) {
                    valid = 1;
                }
            }
        })

        if (valid === 1) {
            return true;
        } else {
            return false;
        }
    }

    function isValidPart2(line) {
        const hypers = line.match(/\w+(?=])/g);
        const supers = line.replace(/\[\w+\]/g, '[]');

        let valid = false;
        hypers.forEach(hyper => {
            if (!valid) {
                hyper.split('').forEach((char, ix, hyper) => {
                    if (!valid && ix >= 2) {
                        if (char === hyper[ix - 2] && char !== hyper[ix - 1]) {
                            const str = hyper[ix - 1] + char + hyper[ix - 1];
                            if (supers.indexOf(str) > -1) {
                                valid = true;
                            }
                        }
                    }
                });
            }
        });

        return valid;
    }

    input
        .split('\n')
        .filter(line => line.length)
        .forEach((line) => {
            if (isValidPart1(line)) {
                part1++;
            }
            if (isValidPart2(line)) {
                part2++;
            }

        });

    return [part1, part2];
}

const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));
