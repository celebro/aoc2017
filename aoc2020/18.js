const fs = require('fs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    /*
    1 + (2 * 3) + (4 * (5 + 6))
    5 + (8 * 3 + 9 + 3 * 4 * 3)
    5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))
    ((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2
    */
    `
   2 * 3 + (4 * 5)

`
].map((x) => x.trim());

function calc1(expr) {
    const stack = [];

    for (const token of expr) {
        let result = 0;
        if (token === ')') {
            result = stack.pop();
            stack.pop(); // get rid of (
        } else if (typeof token === 'number') {
            result = token;
        }

        if (result > 0) {
            if (stack.length > 0 && stack[stack.length - 1] !== '(') {
                const op = stack.pop();
                const value = stack.pop();
                result = operation(value, op, result);
            }
            stack.push(result);
        } else {
            stack.push(token);
        }
    }

    return stack[0];
}

function operation(a, op, b) {
    if (op === '+') {
        return a + b;
    } else {
        return a * b;
    }
}

function calc2(expr) {
    const stack = [];

    for (const token of ['(', ...expr, ')']) {
        let result = 0;
        if (token === ')') {
            result = stack.pop();
            while (true) {
                let op = stack.pop();
                if (op === '(') {
                    break;
                }
                result = result * stack.pop();
            }
        } else if (typeof token === 'number') {
            result = token;
        }

        if (result > 0) {
            if (stack.length > 0 && stack[stack.length - 1] === '+') {
                stack.pop(); // remove +
                result = result + stack.pop();
            }
            stack.push(result);
        } else {
            stack.push(token);
        }
    }

    return stack[0];
}

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = 0;
    const lines = input.split('\n').filter((line) => line.length);

    const exprs = [];
    lines.forEach((line) => {
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
        let result = calc1(expr);
        part1 += result;
    }

    /////////

    for (const expr of exprs) {
        const result = calc2(expr);
        part2 += result;
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
