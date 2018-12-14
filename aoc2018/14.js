const fs = require('fs');
const sscanf = require('scan.js').scan;
// @ts-ignore
const Grid = require('../utils/Grid');
// @ts-ignore
const List = require('../utils/LinkedList');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch(e) {}
const testInput = `

`
.trim();


function run(input) {
    let part1 = undefined;
    let part2 = undefined;

    let inputStr = input.split('\n').filter(line => line.length)[0];
    let inputNum = +inputStr;

    let list = [3, 7];
    let p1 = 0;
    let p2 = 1;

    let key1 = 0
    let key2 = 0;
    const mod1 = Math.pow(10, 10);
    const mod2 = Math.pow(10, inputStr.length);

    function addOne(v) {
        list.push(v);

        key2 = (key2 * 10 + v) % mod2;
        if (key2 === inputNum) {
            part2 = list.length - inputStr.length;
        }

        if (part1 === undefined) {
            key1 = (key1 * 10 + v) % mod1;
            if (list.length === inputNum + 10) {
                part1 = key1;
            }
        }
    }

    while (!part2) {
        let v = list[p1] + list[p2];
        if (v >= 10) {
            addOne(~~(v / 10));
            v = v - 10;
        }
        addOne(v);

        p1 = (p1 + 1 + list[p1]) % list.length;
        p2 = (p2 + 1 + list[p2]) % list.length;
    }

    return [part1, part2];
}

for (const num of ['51589', '01245', '92510', '59414']) {
    const testResult = run(num + '');
    console.log('test: ', num, testResult.join(' / '));
}

console.time('time');
const result = run(input);
console.timeEnd('time');
console.log('result: ', result.join(' / '));
