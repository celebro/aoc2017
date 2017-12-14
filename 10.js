const fs = require('fs');

const input = fs.readFileSync('./10.txt', 'utf8').trim();

function task(input, MAX) {
    const data = [];
    for (let i = 0; i < MAX; i++) {
        data.push(i);
    }

    function norm(n) {
        return ((n % MAX) + MAX) % MAX;
    }

    function swap(data, ixa, ixb) {
        let tmp = data[ixa];
        data[ixa] = data[ixb];
        data[ixb] = tmp;
    }

    let current = 0;
    let skip = 0;

    function run(lengths) {
        lengths.map(Number).forEach(len => {
            const start = current;
            const end = current + len - 1;

            for (let d = 0; d <= ((end - start) / 2); d++) {
                const ixa = norm(start + d);
                const ixb = norm(end - d);
                swap(data, ixa, ixb);
            }

            current = norm(current + len + skip);
            skip += 1;
        });

    }

    const lengths = input.split('').map(ch => ch.charCodeAt(0)).concat([17, 31, 73, 47, 23]);
    for (let i = 0; i < 64; i++) {
        run(lengths);
    }

    const packed = [];
    for (let i = 0; i < MAX; i += 16) {
        const slice = data.slice(i, i + 16);
        const tmp = slice.reduce((rv, num) => rv ^ num, 0); // XOR
        packed.push(tmp);
    }

    const hash = packed.map(num => {
        let tmp = num.toString(16);
        if (tmp.length === 1) {
            tmp = '0' + tmp;
        }
        return tmp;
    }).join('');

    console.log(hash);
}

task(input, 256);
