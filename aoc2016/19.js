function run(input) {
    function go1() {
        const data = new Uint32Array(input);
        for (let i = 0; i < data.length; i++) {
            data[i] = i + 1;
        }

        let i = 0;
        let p = 0;
        let remaining = input;

        while (remaining > 1) {
            while (p < remaining) {
                data[i] = data[p];
                i = i + 1;
                p = p + 2;
            }

            i = 0;
            if (p === remaining) {
                p = 0;
                remaining = Math.floor(remaining / 2);
            } else {
                p = 1;
                remaining = Math.ceil(remaining / 2);
            }
        }

        return data[0];
    }

    function go2() {
        const data = new Uint32Array(input);
        for (let i = 0; i < data.length; i++) {
            data[i] = i + 1;
        }

        let length = input;
        let remaining = input;
        let current = -1;       // Current element (elf that steals)
        let search = -1;        // Pointer to where we searched next items to
        let skipLeft = 0;       // Number of removed items left of 'current'
        let skipRight = 0;      // Number of removed items right of 'current'

        while (remaining > 1) {
            do {
                // Find next non-removed item, might need to skip some
                search += 1;
                if (search >= length) {
                    // When we reach the end, start from the beginning (wrap)
                    search -= length;
                    skipRight = 0;
                    length = current + 1;
                }
            } while (data[search] === 0);

            current += 1;
            if (current === length) {
                // If ended
                current = 0;
                skipRight = skipLeft;
                skipLeft = 0;
            }

            // This allows for the array to shorten, we pack it as we go
            data[current] = data[search];

            let next = current + Math.floor(remaining / 2) + skipRight;
            if (next >= length) {
                next = next - length + skipLeft;
                skipLeft += 1;
            } else {
                skipRight += 1;
            }
            data[next] = 0;

            remaining -= 1;

            // // Logging
            // let tmp = Array.from(data).map(String);
            // tmp.splice(length, 0, '|');
            // console.log(tmp.join('') + ' (' + remaining + ')');
            // let empty = new Array(input).fill(' ');
            // empty[current] = 'c';
            // empty[search] = 's';
            // console.log(empty.join(''));
            // console.log(Object.entries({ skipLeft, skipRight }).map(([key, val]) => key + ': ' + val).join(', '));
            // console.log('');
            // debugger;
        }

        return data[current];
    }

    const part1 = go1();
    const part2 = go2();

    return [part1, part2];
}

var testResult = run(6);
console.log('test: ', testResult.join(' / '));

const result = run(3017957);
console.log('result: ', result.join(' / '));
