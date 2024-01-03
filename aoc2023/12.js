const fs = require('fs');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1
`
].map((x) => x.trim());

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = 0;
    const lines = input.split('\n').filter((line) => line.length);

    lines.forEach((line) => {
        const [rawdata, record] = line.split(' ');
        const data = rawdata.split('');
        data.push('.'); // for easier calculations
        const counts = record.split(',').map(Number);
        part1 += analyse(data, counts);
    });

    lines.forEach((line) => {
        const [rawdata, record] = line.split(' ');
        const data = [rawdata, rawdata, rawdata, rawdata, rawdata].join('?').split('');
        data.push('.'); // for easier calculations
        const counts = [record, record, record, record, record].join(',').split(',').map(Number);
        part2 += analyse(data, counts);
    });

    return [part1, part2];
}

/**
 *
 * @param {string[]} data
 * @param {number[]} counts
 */
function analyse(data, counts) {
    const lookup = {};

    /**
     *
     * @param {number} ixData
     * @param {number} ixCounts
     * @param {number} remainingCount
     * @param {string} last
     */
    function r(ixData, ixCounts, remainingCount, last) {
        if (ixData === data.length) {
            if (ixCounts === counts.length) {
                return 1;
            }
            return 0;
        }

        const key = [ixData, ixCounts, remainingCount, data[ixData], last].join(' ');
        if (lookup[key] !== undefined) {
            return lookup[key];
        }

        let okChildren = 0;
        if (data[ixData] === '?') {
            data[ixData] = '.';
            okChildren += r(ixData, ixCounts, remainingCount, last);
            data[ixData] = '#';
            okChildren += r(ixData, ixCounts, remainingCount, last);
            data[ixData] = '?';
        } else if (data[ixData] === '.') {
            if (last === '#' && remainingCount === 0) {
                okChildren += r(ixData + 1, ixCounts + 1, counts[ixCounts + 1] || 0, data[ixData]);
            } else if (last === '.') {
                okChildren += r(ixData + 1, ixCounts, remainingCount, data[ixData]);
            } else {
                // invalid, noop
            }
        } else if (data[ixData] === '#') {
            if (ixCounts === counts.length) {
                // invalid
            } else if (remainingCount > 0) {
                okChildren += r(ixData + 1, ixCounts, remainingCount - 1, data[ixData]);
            } else {
                // invalid, noop
            }
        }

        lookup[key] = okChildren;

        return okChildren;
    }

    return r(0, 0, counts[0], '.');
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
