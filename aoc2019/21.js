const fs = require('fs');
// @ts-ignore
const Grid = require('../utils/Grid');
// @ts-ignore
const List = require('../utils/LinkedList');
const Computer = require('./computer');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const code = input.split('\n').filter(line => line.length)[0];

    function doStuff(script) {
        let computer = new Computer(code);
        computer.addAscii(script);
        const output = computer.run();

        let str = [];
        let result;
        output.forEach(x => {
            if (x < 200) {
                str.push(String.fromCharCode(x));
            } else {
                result = x;
            }
        });
        console.log(str.join(''));
        return result;
    }

    const script1 = `
        NOT A T
        NOT B J
        OR J T
        NOT C J
        OR J T
        NOT D J
        NOT J J
        AND T J
        WALK
    `;

    const script2 = `
        // !C & D & !E & H
        NOT C J
        NOT E T
        AND T J
        AND H J

        // | E & !I
        NOT I T
        AND E T
        OR T J

        // | A | B) & d
        NOT A T
        OR T J
        NOT B T
        OR T J
        AND D J
        RUN
    `;

    part1 = doStuff(script1);
    part2 = doStuff(script2);

    return [part1, part2];
}

const result = run(input);
console.log('result: ', result.join(' / '));
