const fs = require('fs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
1
2
3
4
5
7
8
9
10
11
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter((line) => line.length);

    const nums = [];
    let totalSum = 0;
    lines.forEach((line) => {
        nums.push(+line);
        totalSum += +line;
    });

    let targetSum = totalSum / 3;

    nums.reverse();

    let bestNum = Infinity;
    let bestProduct = Infinity;

    function r(i, num, sum, product) {
        if (num > bestNum || i >= nums.length) {
            return;
        }

        let selectedNum = num + 1;
        let selectedSum = sum + nums[i];
        let selectedProduct = product * nums[i];

        if (selectedSum === targetSum) {
            // found one
            if (selectedNum < bestNum || (selectedNum === bestNum && selectedProduct < bestProduct)) {
                bestNum = selectedNum;
                bestProduct = selectedProduct;
            }

            return;
        } else if (selectedSum < targetSum) {
            r(i + 1, selectedNum, selectedSum, selectedProduct);
        }

        r(i + 1, num, sum, product);
    }

    r(0, 0, 0, 1);
    part1 = bestProduct;

    targetSum = totalSum / 4;
    bestNum = Infinity;
    bestProduct = Infinity;
    r(0, 0, 0, 1);
    part2 = bestProduct;

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
