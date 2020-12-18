const fs = require('fs');
const sscanf = require('scan.js').scan;
// @ts-ignore
const Grid = require('../utils/Grid');
// @ts-ignore
const List = require('../utils/LinkedList');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
1 + (2 * 3) + (4 * (5 + 6))
2 * 3 + (4 * 5)
5 + (8 * 3 + 9 + 3 * 4 * 3)
5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))
((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = 0;
    const lines = input.split('\n').filter((line) => line.length);

    const exprs = [];
    lines.forEach((line, ix) => {
        const expr = line
            .replace(/\s/g, '')
            .split('')
            .map((char) => {
                const value = +char;
                if (!isNaN(value)) {
                    return value;
                }
                return char;
            });
        exprs.push(expr);
    });

    for (const expr of exprs) {
        let result = calc(expr, 0, expr.length - 1);
        part1 += result;
    }

    function calc(expr, from, to) {
        let count = 0;
        let left;
        let right;
        let op;
        for (let i = to; i >= from; i--) {
            const token = expr[i];
            if (token === '(') {
                count--;
                if (count === 0) {
                    right = calc(expr, i + 1, to - 1);
                }
            } else if (token === ')') {
                count++;
            } else if (count === 0) {
                if (typeof token === 'number') {
                    right = token;
                } else {
                    op = token;
                    left = calc(expr, from, i - 1);
                    break;
                }
            }
        }

        let result;
        if (op === undefined) {
            result = right;
        } else if (op === '*') {
            result = left * right;
        } else {
            result = left + right;
        }
        return result;
    }

    /////////

    console.time('p2');
    for (const expr of exprs) {
        const result = calc2(expr, 0, expr.length - 1, '*');
        part2 += result;
    }
    console.timeEnd('p2');

    function calc2(expr, from, to, op) {
        // console.log(expr.slice(from, to + 1).join(''));
        if (from === to) {
            // console.log('const', expr[from]);
            return expr[from];
        }

        const values = [];
        let count = 0;
        let last = from;
        for (let i = from; i <= to; i++) {
            const token = expr[i];
            if (token === '(') {
                count++;
            } else if (token === ')') {
                count--;
            }
            if (count === 0 && (token === op || i === to)) {
                const nextFrom = last;
                const nextTo = i === to ? to : i - 1;

                if (i === to && op === '+' && expr[nextFrom] === '(' && expr[nextTo] === ')') {
                    values.push(calc2(expr, nextFrom + 1, nextTo - 1, '*'));
                } else {
                    values.push(calc2(expr, nextFrom, nextTo, '+'));
                }

                last = i + 1;
            }
        }

        let result = 0;
        if (op === '*') {
            result = 1;
            for (const value of values) {
                result *= value;
            }
        } else {
            for (const value of values) {
                result += value;
            }
        }

        // console.log('===', expr.slice(from, to + 1).join(''), ' -> ', result);
        return result;
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
