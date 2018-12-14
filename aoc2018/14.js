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

    let list = new Uint8Array(300000000);
    list[0] = 3;
    list[1] = 7;
    let listLen = 2;

    let p1 = 0;
    let p2 = 1;

    let key2 = 0;
    const mod2 = Math.pow(10, inputStr.length);

    function addOne(v) {
        list[listLen++] = v;

        key2 = (key2 * 10 + v) % mod2;
        if (key2 === inputNum) {
            part2 = listLen - inputStr.length;
        }

        if (part1 === undefined) {
            if (listLen === inputNum + 10) {
                part1 = 0;
                for (let i = listLen - 10; i < listLen; i++) {
                    part1 = part1 * 10 + list[i];
                }
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

        p1 = (p1 + 1 + list[p1]);
        while (p1 >= listLen) {
            p1 = p1 - listLen;
        }
        p2 = p2 + 1 + list[p2];
        while (p2 >= listLen) {
            p2 = p2 - listLen;
        }
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
