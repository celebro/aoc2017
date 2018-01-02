const fs = require('fs');

const input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInput = `
101 301 501
102 302 502
103 303 503
201 401 601
202 402 602
203 403 603
`.trim();

function run(input) {
    let part1 = 0;
    let part2 = 0;

    input
        .split('\n')
        .filter(line => line.length)
        .map(line => {
            const nums = line.match(/\d+/g).map(Number).sort((a, b) => a - b);
            if (nums[0] + nums[1] > nums[2]) {
                part1++;
            }
        });

    let tmp = [[],[],[]];
    input
        .split('\n')
        .filter(line => line.length)
        .map(line => {
            const nums = line.match(/\d+/g).map(Number);
            nums.forEach((num, ix) => {
                tmp[ix].push(num);
                if (tmp[ix].length === 3) {
                    let col = tmp[ix].sort((a, b) => a - b);
                    if (col[0] + col[1] > col[2]) {
                        part2++;
                    }
                    tmp[ix].length = 0;
                }
            })
        });

    return [part1, part2];
}

const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));
