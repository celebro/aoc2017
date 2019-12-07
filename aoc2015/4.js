const md5 = require('md5');

function run(input) {
    let part1 = undefined;
    let part2 = undefined;

    let num = 1;
    while (part1 === undefined || part2 === undefined) {
        const hash = md5(input + num);
        if (part1 === undefined && hash.startsWith('00000')) {
            part1 = num;
        }
        if (hash.startsWith('000000')) {
            part2 = num;
        }
        num += 1;
    }

    return [part1, part2];
}

const testResult = run('abcdef');
console.log('test: ', testResult.join(' / '));

const result = run('yzbqklnj');
console.log('result: ', result.join(' / '));
