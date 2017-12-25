function run(input) {
    let part1;
    let part2;

    const buf = [0];
    let ix = 0;

    for (let step = 1; step <= 2017; step++) {
        ix = ((ix + input) % buf.length) + 1;
        buf.splice(ix, 0, step);
    }

    const ix2017 = buf.indexOf(2017);
    part1 = buf[(ix2017 + 1) % buf.length];

    ix = 0;
    for (let step = 1; step <= 50000000; step++) {
        ix = ((ix + input) % step) + 1;
        if (ix === 1) {
            part2 = step;
        }
    }

    return [part1, part2];
}

const testResult = run(3);
console.log('test: ', testResult.join(' / '));

console.time('time');
const result = run(335);
console.timeEnd('time');
console.log('result: ', result.join(' / '));
