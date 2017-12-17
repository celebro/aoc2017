console.time('time');

const fs = require('fs');

const input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInput = `
s1,x3/4,pe/b
`.trim();

function run(input, len) {
    let part1 = 0;
    let part2 = 0;

    let positions = [];
    for (let i = 0; i < len; i++) {
        positions.push(String.fromCharCode('a'.charCodeAt(0) + i));
    }

    const parsed = input.split(',').map(move => {
        const [, command, a, b] = move.match(/([s,x,p])(\d+|\w)\/?(\d+|\w)?/);
        return {
            command, a, b, ai: +a, bi: +b
        };
    });

    function dance() {
        parsed.forEach(({ command, a, b, ai }) => {
            switch (command) {
                case 's':
                    positions.splice(0, 0, ...positions.splice(-ai))
                    break;
                case 'x':
                    let tmp = positions[b];
                    positions[b] = positions[a];
                    positions[a] = tmp;
                    break;
                case 'p':
                    const ixa = positions.indexOf(a);
                    const ixb = positions.indexOf(b);
                    let tmp2 = positions[ixb];
                    positions[ixb] = positions[ixa];
                    positions[ixa] = tmp2;
                    break;
            }
        });

        return positions.join('');
    }

    part1 = dance();

    const map1 = new Map();
    const map2 = new Map();
    map1.set(part1, 0);

    let i = 1;
    while (true) {
        const str = dance();
        if (map1.has(str)) {
            part2 = map2.get((1000000000 - 1) % i)
            break;
        } else {
            map1.set(str, i);
            map2.set(i, str);
        }
        i++;
    }

    return [part1, part2];
}

const testResult = run(testInput, 5);
console.log('test: ', testResult.join(' / '));

const result = run(input, 16);
console.log('result: ', result.join(' / '));

console.timeEnd('time');
