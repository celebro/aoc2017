const fa = 16807;
const fb = 48271;
const mod = 2147483647;

const low16 = Math.pow(2, 16) - 1;

function run(_a, _b) {
    let part1 = 0;
    let part2 = 0;

    let a = _a;
    let b = _b;
    for (let i = 0; i < 40000000; i++) {
        a = (a * fa) % mod;
        b = (b * fb) % mod;

        if ((a & low16) === (b & low16)) {
            part1++;
        }
    }

    a = _a;
    b = _b;
    for (let i = 0; i < 5000000; i++) {
        do {
            a = (a * fa) % mod;
        } while ((a & 3) !== 0)

        do {
            b = (b * fb) % mod;
        } while ((b & 7) !== 0)

        if ((a & low16) === (b & low16)) {
            part2++;
        }
    }

    return [part1, part2];
}


console.time('test');
const testResult = run(65, 8921);
console.timeEnd('test');
console.log('test: ', testResult.join(' / '));

console.time('time');
const result = run(277, 349);
console.timeEnd('time');
console.log('result: ', result.join(' / '));
