const fs = require('fs');
const sscanf = require('scan.js').scan;
// @ts-ignore
const Grid = require('../utils/Grid');
// @ts-ignore
const List = require('../utils/LinkedList');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
ecl:gry pid:860033327 eyr:2020 hcl:#fffffd
byr:1937 iyr:2017 cid:147 hgt:183cm

iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884
hcl:#cfa07d byr:1929

hcl:#ae17e1 iyr:2013
eyr:2024
ecl:brn pid:760753108 byr:1931
hgt:179cm

hcl:#cfa07d eyr:2025 pid:166559648
iyr:2011 ecl:brn hgt:59in
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = 0;
    const lines = input.split('\n');

    let passport = {};
    let passports = [passport];

    lines.forEach((line, ix) => {
        if (line.length === 0) {
            passport = {};
            passports.push(passport);
        } else {
            const parts = line.split(' ');
            for (const part of parts) {
                const [key, value] = part.split(':');
                passport[key] = value;
            }
        }
    });

    for (const pass of passports) {
        const numKeys = Object.keys(pass).length;
        if ((numKeys === 7 && !('cid' in pass)) || numKeys === 8) {
            part1++;
        }

        const byr = parseInt(pass.byr, 10);
        if (!(byr >= 1920 && byr <= 2002)) {
            continue;
        }

        const iyr = parseInt(pass.iyr, 10);
        if (!(iyr >= 2010 && iyr <= 2020)) {
            continue;
        }

        const eyr = parseInt(pass.eyr, 10);
        if (!(eyr >= 2020 && eyr <= 2030)) {
            continue;
        }

        /** @type string */
        const hgt = pass.hgt;
        if (!hgt) {
            continue;
        } else if (hgt.endsWith('cm')) {
            const cm = parseInt(hgt.slice(0, -2));
            if (!(cm >= 150 && cm <= 193)) {
                continue;
            }
        } else if (hgt.endsWith('in')) {
            const inc = parseInt(hgt.slice(0, -2));
            if (!(inc >= 59 && inc <= 76)) {
                continue;
            }
        } else {
            continue;
        }

        if (!pass.hcl || !pass.hcl.match(/^#[0-9a-f]{6}$/)) {
            continue;
        }

        if (!['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(pass.ecl)) {
            continue;
        }

        if (!pass.pid || !pass.pid.match(/^\d{9}$/)) {
            continue;
        }

        part2++;
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
