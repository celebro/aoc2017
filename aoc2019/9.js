const fs = require('fs');
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
    const lines = input.split('\n').filter(line => line.length);
    const code = lines[0];

    part1 = Computer.runWithInput(code, [1]);
    part2 = Computer.runWithInput(code, [2]);

    return [part1, part2];
}

console.log('test: ', Computer.runWithInputFull('109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99').join(', '));
console.log('test: ', Computer.runWithInputFull('1102,34915192,34915192,7,4,7,99,0').join(', '));
console.log('test: ', Computer.runWithInputFull('104,1125899906842624,99').join(', '));

const result = run(input);
console.log('result: ', result.join(' / '));
