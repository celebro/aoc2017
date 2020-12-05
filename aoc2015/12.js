const input = require('./12.json');

/**
 * @param {any} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;

    function sumRecursive(obj, ignoreRed) {
        let sum = 0;

        for (const value of Object.values(obj)) {
            if (ignoreRed && value === 'red' && !Array.isArray(obj)) {
                sum = 0;
                break;
            } else if (typeof value === 'number') {
                sum += value;
            } else if (typeof value === 'string') {
                // noop
            } else {
                sum += sumRecursive(value, ignoreRed);
            }
        }

        return sum;
    }

    part1 = sumRecursive(input, false);
    part2 = sumRecursive(input, true);

    return [part1, part2];
}

const result = run(input);
console.log('result: ', result.join(' / '));
