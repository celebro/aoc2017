const fs = require('fs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`,
    `
two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen
`
].map((x) => x.trim());

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = 0;
    const lines = input.split('\n').filter((line) => line.length);
    lines.forEach((line, ix) => {
        const p1 = [];
        const p2 = [];
        line.split('').forEach((char, i) => {
            const sub = line.slice(i);
            if (sub.startsWith('one')) p2.push(1);
            if (sub.startsWith('two')) p2.push(2);
            if (sub.startsWith('three')) p2.push(3);
            if (sub.startsWith('four')) p2.push(4);
            if (sub.startsWith('five')) p2.push(5);
            if (sub.startsWith('six')) p2.push(6);
            if (sub.startsWith('seven')) p2.push(7);
            if (sub.startsWith('eight')) p2.push(8);
            if (sub.startsWith('nine')) p2.push(9);
            // @ts-ignore
            if (!isNaN(char)) {
                p1.push(Number(char));
                p2.push(Number(char));
            }
        });

        const cal1 = 10 * p1.at(0) + p1.at(-1);
        const cal2 = 10 * p2.at(0) + p2.at(-1);

        part1 += cal1;
        part2 += cal2;
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
