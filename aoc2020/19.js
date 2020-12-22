const { match } = require('assert');
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
42: 9 14 | 10 1
9: 14 27 | 1 26
10: 23 14 | 28 1
1: "a"
11: 42 31
5: 1 14 | 15 1
19: 14 1 | 14 14
12: 24 14 | 19 1
16: 15 1 | 14 14
31: 14 17 | 1 13
6: 14 14 | 1 14
2: 1 24 | 14 4
0: 8 11
13: 14 3 | 1 12
15: 1 | 14
17: 14 2 | 1 7
23: 25 1 | 22 14
28: 16 1
4: 1 1
20: 14 14 | 1 15
3: 5 14 | 16 1
27: 1 6 | 14 18
14: "b"
21: 14 1 | 1 14
25: 1 1 | 1 14
22: 14 14
8: 42
26: 14 22 | 1 20
18: 15 15
7: 14 5 | 1 21
24: 14 1

abbbbbabbbaaaababbaabbbbabababbbabbbbbbabaaaa
bbabbbbaabaabba
babbbbaabbbbbabbbbbbaabaaabaaa
aaabbbbbbaaaabaababaabababbabaaabbababababaaa
bbbbbbbaaaabbbbaaabbabaaa
bbbababbbbaaaaaaaabbababaaababaabab
ababaaaaaabaaab
ababaaaaabbbaba
baabbaaaabbaaaababbaababb
abbbbabbbbaaaababbbbbbaaaababb
aaaaabbaabaaaaababaa
aaaabbaaaabbaaa
aaaabbaabbaaaaaaabbbabbbaaabbaabaaa
babaaabbbaaabaababbaabababaaab
aabbbbbaabbbaaaaaabbbbbababaaaaabbaaabba
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

    const rules = {};
    const msgs = [];
    let stop = false;

    lines.forEach((line) => {
        if (line.includes(':')) {
            parseRule(line);
        } else {
            msgs.push(line);
        }
    });

    function parseRule(line) {
        const [id, ruleString] = line.split(': ');
        const ruleList = ruleString.split(' | ').map((subRule) => subRule.replace(/"/g, '').split(' '));
        rules[id] = ruleList;
    }

    for (const msg of msgs) {
        if (r(msg, rules[0], 0) === msg.length) {
            part1++;
        }
    }

    console.time('p2');

    parseRule('8: 42 | 8 42');
    parseRule('11: 42 31 | 42 11 31');

    for (const rule of Object.values(rules)) {
        rule.reverse();
        for (const alt of rule) {
            alt.reverse();
        }
    }

    for (const msg of msgs) {
        if (r(msg.split('').reverse().join(''), rules[0], 0) === msg.length) {
            part2++;
        }
    }

    console.timeEnd('p2');

    function r(msg, alternatives, currentMatchedLengh) {
        nextAlt: for (const alt of alternatives) {
            // each alternative
            let matchedLength = currentMatchedLengh;

            for (const id of alt) {
                if (id === 'a' || id === 'b') {
                    if (id === msg[matchedLength]) {
                        matchedLength++;
                    } else {
                        continue nextAlt;
                    }
                } else {
                    const child = rules[id];
                    matchedLength = r(msg, child, matchedLength);
                    if (matchedLength < 0) {
                        continue nextAlt;
                    }
                }
            }
            return matchedLength;
        }
        return -1;
    }

    return [part1, part2];
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

for (let i = 0; i < 100; i++) {
    const result = run(input);
    console.log('result: ', result.join(' / '));
}
