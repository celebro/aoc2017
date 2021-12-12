const fs = require('fs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]
`
].map((x) => x.trim());

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = undefined;
    const lines = input.split('\n').filter((line) => line.length);

    const map = {
        '(': ')',
        '[': ']',
        '{': '}',
        '<': '>'
    };

    const scores = [];

    for (const line of lines) {
        let stack = [];
        for (const char of line) {
            if (char in map) {
                // start new chunk
                stack.push(char);
            } else if (map[stack.pop()] === char) {
                // end of chunk
            } else {
                // corrupt chunk
                const values = {
                    ')': 3,
                    ']': 57,
                    '}': 1197,
                    '>': 25137
                };
                part1 += values[char];
                stack = undefined;
                break;
            }
        }

        if (stack) {
            const values = {
                ')': 1,
                ']': 2,
                '}': 3,
                '>': 4
            };
            let score = 0;
            while (stack.length) {
                const value = values[map[stack.pop()]];
                score = 5 * score + value;
            }
            scores.push(score);
        }
    }

    scores.sort((a, b) => a - b);
    part2 = scores[(scores.length - 1) / 2];

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
