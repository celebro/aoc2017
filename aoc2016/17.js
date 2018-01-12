const md5 = require('md5');
const Queue = require('./queue');

const UP = 0;
const DOWN = 1;
const LEFT = 2;
const RIGHT = 3;

function run(input) {
    let part1;
    let part2;

    const targetX = 3;
    const targetY = 3;

    function go(part) {
        const queue = new Queue();
        queue.enq({ x: 0, y: 0, path: '' });

        const unlocked = { b: true, c: true, d: true, e: true, f: true };

        let result;

        while (queue.size() > 0) {
            const { x, y, path } = queue.deq();
            if (x === targetX && y === targetY) {
                result = path;
                if (part === 1) {
                    break;
                }
            } else {
                const key = md5(input + path);

                if (y > 0 && unlocked[key.charAt(UP)]) {
                    queue.enq({ x, y: y - 1, path: path + 'U'});
                }
                if (y < 3 && unlocked[key.charAt(DOWN)]) {
                    queue.enq({ x, y: y + 1, path: path + 'D' });
                }
                if (x > 0 && unlocked[key.charAt(LEFT)]) {
                    queue.enq({ x: x - 1, y, path: path + 'L' });
                }
                if (x < 3 && unlocked[key.charAt(RIGHT)]) {
                    queue.enq({ x: x + 1, y, path: path + 'R' });
                }
            }
        }

        return part === 1 ? result : result.length;
    }

    part1 = go(1);
    part2 = go(2);

    return [part1, part2];
}

console.log('test: ', run('ihgpwlah').join(' / '));
console.log('test: ', run('kglvqrro').join(' / '));
console.log('test: ', run('ulqzkmiv').join(' / '));

const result = run('pvhmgsws');
console.log('result: ', result.join(' / '));
