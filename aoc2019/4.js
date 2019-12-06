const fs = require('fs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInput = `

`.trim();

function run(input) {
    let part1 = 0;
    let part2 = 0;
    const lines = input.split('\n').filter(line => line.length);

    const [min, max] = lines[0].split('-').map(Number);

    for (let i = min; i <= max; i++) {
        let count = 1;
        let doubleDigits = false;
        let exactDoubleDigits = false;
        let increase = true;
        const nums = String(i)
            .split('')
            .map(Number);

        for (let j = 1; j < nums.length; j++) {
            if (nums[j] === nums[j - 1]) {
                doubleDigits = true;
                count = count + 1;
            } else {
                if (count === 2) {
                    exactDoubleDigits = true;
                }
                count = 1;
            }
            if (nums[j] < nums[j - 1]) {
                increase = false;
                break;
            }
        }

        if (increase && doubleDigits) {
            part1++;
        }
        if (increase && (exactDoubleDigits || count === 2)) {
            part2++;
            // 482 too low
        }
    }

    return [part1, part2];
}

// const testResult = run(testInput);
// console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));
