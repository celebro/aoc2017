const fs = require('fs');

const input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInput = `
Disc #1 has 5 positions; at time=0, it is at position 4.
Disc #2 has 2 positions; at time=0, it is at position 1.
`.trim();

function run(input) {
    let part1 = 0;
    let part2 = 0;

    const disks = input
        .split('\n')
        .filter(line => line.length)
        .map((line) => {
            const len = +line.match(/has (\d+)/)[1];
            const start = +line.match(/(\d+)\./)[1];
            return { len, start };
        });

    function go(part) {
        if (part === 2) {
            disks.push({ len: 11, start: 0});
        }

        let time = 0;
        let fallThrough = false;
        while(!fallThrough) {
            fallThrough = disks.every(({ len, start }, i) => {
                return (start + i + 1 + time) % len === 0;
            });
            time++;
        }

        return time - 1;
    }

    part1 = go(1);
    part2 = go(2);

    return [part1, part2];
}

const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));
