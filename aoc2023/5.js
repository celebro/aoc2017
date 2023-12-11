const fs = require('fs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4
`
].map((x) => x.trim());

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter((line) => line.length);

    {
        let mode = 'seeds';
        let current = new Set();
        let next = new Set();
        lines.forEach((line) => {
            if (mode === 'seeds') {
                current = new Set(line.split(': ').at(1).split(' ').map(Number));
                mode = 'map';
                return;
            }

            if (line.includes('map')) {
                current = new Set([...current, ...next]);
                next = new Set();
            }

            const [dest, source, range] = line.split(' ').map(Number);

            for (const value of current) {
                if (value >= source && value <= source + range) {
                    current.delete(value);
                    next.add(dest + (value - source));
                }
            }
        });

        current = new Set([...current, ...next]);
        part1 = Math.min(...current.values());
    }

    //
    {
        let mode = 'seeds';
        /** @type {Array<{start: number, end: number}>} */
        let current = [];
        /** @type {Array<{start: number, end: number}>} */
        let next = [];

        lines.forEach((line) => {
            if (mode === 'seeds') {
                const nums = line.split(': ').at(1).split(' ').map(Number);
                for (let i = 0; i < nums.length; i += 2) {
                    current.push({ start: nums[i], end: nums[i] + nums[i + 1] - 1 });
                }

                mode = 'map';
                return;
            }

            if (line.includes('map')) {
                current = [...current, ...next];
                next = [];
            }

            const [dest, source, range] = line.split(' ').map(Number);

            let temp = [];
            for (const obj of current) {
                if (obj.end >= source && obj.start <= source + range) {
                    if (obj.start < source) {
                        // -----
                        //   ------
                        temp.push({ start: obj.start, end: source - 1 });
                        obj.start = source;
                    }

                    if (obj.end > source + range) {
                        //    ------
                        //  -----
                        temp.push({ start: source + range + 1, end: obj.end });
                        obj.end = source + range;
                    }

                    next.push({ start: dest + (obj.start - source), end: dest + (obj.end - source) });
                } else {
                    temp.push(obj);
                }
            }
            current = temp;
        });

        current = [...current, ...next];
        part2 = Math.min(...current.map((x) => x.start));
    }

    return [part1, part2];
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
