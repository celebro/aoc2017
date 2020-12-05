const fs = require('fs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = ['abcdefgh', 'ghjaaaaa'].map((x) => x.trim());

function code(a) {
    return a.charCodeAt(0) - 'a'.charCodeAt(0);
}

function char(a) {
    return String.fromCharCode(a + 'a'.charCodeAt(0));
}

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const original = input.split('\n').filter((line) => line.length)[0];

    const pwd = original.split('').map(code);

    const Z = code('z');
    const I = code('i');
    const O = code('o');
    const L = code('l');

    while (true) {
        for (let i = pwd.length - 1; i >= 0; i--) {
            let next = pwd[i] + 1;
            if (next === I || next === O || next === L) {
                next = next + 1;
            }

            if (next > Z) {
                pwd[i] = 0;
            } else {
                pwd[i] = next;
                break;
            }
        }

        if (validate(pwd)) {
            if (!part1) {
                part1 = pwd.map(char).join('');
            } else {
                part2 = pwd.map(char).join('');
                break;
            }
        }
    }

    return [part1, part2];
}

function validate(pwd) {
    let isStraight = false;
    let isDouble = false;

    let doubles = -1;
    let straight = 0;

    for (let i = 1; i < pwd.length; i++) {
        let current = pwd[i];
        let last = pwd[i - 1];

        if (current === last + 1) {
            straight += 1;
            if (straight === 2) {
                isStraight = true;
            }
        } else {
            straight = 0;
        }

        if (current === last && current !== doubles) {
            if (doubles !== -1) {
                isDouble = true;
            }
            doubles = current;
        }
    }

    return isStraight && isDouble;
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
