const fs = require('fs');

const input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInput = `
ADVENT
A(1x5)BC
(3x3)XYZ
A(2x2)BCD(2x2)EFG
(6x1)(1x3)A
X(8x2)(3x3)ABCY
(27x12)(20x12)(13x14)(7x10)(1x12)A
(25x3)(3x3)ABC(2x3)XY(5x2)PQRSTX(18x9)(3x2)TWO(5x7)SEVEN
`.trim();

function go1(input) {
    const regex = /\((\w+)x(\w+)\)/g;

    const result = [];
    let lastIx = 0;

    let exec;
    while((exec = regex.exec(input)) !== null) {
        result.push(input.substring(lastIx, exec.index));
        const next = +exec[1];
        const repeat = +exec[2];

        result.push(input.substr(regex.lastIndex, next).repeat(repeat));
        lastIx = regex.lastIndex + next;
        regex.lastIndex = lastIx;
    }

    result.push(input.substring(lastIx));

    return result.join('').length;
}

function go2(input) {
    const count = new Array(input.length).fill(1);
    const commands = [];
    const regex = /\((\w+)x(\w+)\)/g;

    let exec;
    while ((exec = regex.exec(input)) !== null) {
        commands.push({
            nullFrom: exec.index,
            index: regex.lastIndex,
            next: +exec[1],
            repeat: +exec[2]
        });
    }

    commands.reverse().forEach(({ nullFrom, index, next, repeat }) => {
        for (; nullFrom < index; nullFrom++) {
            count[nullFrom] = 0;
        }
        for (let i = 0; i < next; i++) {
            count[i + index]  = count[i + index] * repeat
        }
    });

    return count.reduce((rv, num) => rv + num, 0);
}

function run(input) {
    let part1 = 0;
    let part2 = 0;

    const str = input
        .split('\n').join('');

    part1 = go1(str);
    part2 = go2(str);

    return [part1, part2];
}

testInput.split('\n').forEach(input => {
    const testResult = run(input);
    console.log('test: ', testResult.join(' / '));
});

const result = run(input);
console.log('result: ', result.join(' / '));
