const fs = require('fs');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9
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
        let nums = line.split(' ').map(Number);

        let lastDiff = undefined;
        let safe = true;
        for (let i = 1; i < nums.length; i++) {
            let a = nums[i - 1];
            let b = nums[i];
            let diff = a - b;
            let diffAbs = Math.abs(diff);

            if (diffAbs < 1 || diffAbs > 3) {
                safe = false;
                break;
            }
            if (lastDiff !== undefined && lastDiff * diff < 0) {
                safe = false;
                break;
            }
            lastDiff = diff;
        }

        if (safe) {
            part1++;
        }
    });

    lines.forEach((line) => {
        let nums = line.split(' ').map(Number);

        for (let skipIndex = 0; skipIndex < nums.length; skipIndex++) {
            let lastDiff = undefined;
            let safe = true;
            let newNums = nums.filter((_, ix) => ix !== skipIndex);

            for (let i = 1; i < newNums.length; i++) {
                let a = newNums[i - 1];
                let b = newNums[i];
                let diff = a - b;
                let diffAbs = Math.abs(diff);

                if (diffAbs < 1 || diffAbs > 3) {
                    safe = false;
                    break;
                }
                if (lastDiff !== undefined && lastDiff * diff < 0) {
                    safe = false;
                    break;
                }
                lastDiff = diff;
            }

            if (safe) {
                part2++;
                break;
            }
        }
    });

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
