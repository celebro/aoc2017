const fs = require('fs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce
`
].map((x) => x.trim());

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = 0;
    const lines = input.split('\n').filter((line) => line.length);

    const lengthToNumber = {
        2: 1,
        3: 7,
        4: 4,
        7: 8
    };

    lines.forEach((line) => {
        const [_patters, _digits] = line.split(' | ');
        const patterns = _patters.split(' ');
        const digits = _digits.split(' ');

        const map = [];
        /** @type string[][] */
        const byLength = [];
        for (const pattern of patterns) {
            byLength[pattern.length] = byLength[pattern.length] || [];
            byLength[pattern.length].push(pattern);
        }

        map[1] = byLength[2][0];
        map[4] = byLength[4][0];
        map[7] = byLength[3][0];
        map[8] = byLength[7][0];

        /**
         * @param {string} big
         * @param {string} small
         */
        function inCommon(big, small) {
            let commonCharCount = 0;
            for (const char of small) {
                if (big.includes(char)) {
                    commonCharCount++;
                }
            }
            return commonCharCount;
        }

        const n235 = byLength[5];
        map[3] = n235.find((x) => inCommon(x, map[1]) === 2);

        const n069 = byLength[6];
        map[6] = n069.find((x) => inCommon(x, map[1]) === 1);

        const n25 = n235.filter((x) => x !== map[3]);
        map[5] = n25.find((x) => inCommon(x, map[6]) === 5);
        map[2] = n25.find((x) => x !== map[5]);

        const n09 = n069.filter((x) => x !== map[6]);
        map[0] = n09.find((x) => inCommon(x, map[3]) === 4);
        map[9] = n09.find((x) => x !== map[0]);

        let number = 0;
        for (const digit of digits) {
            if (digit.length in lengthToNumber) {
                part1++;
            }

            for (let i = 0; i < map.length; i++) {
                if (digit.length === map[i].length && inCommon(digit, map[i]) === digit.length) {
                    number = number * 10 + i;
                    break;
                }
            }
        }

        part2 += number;
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
