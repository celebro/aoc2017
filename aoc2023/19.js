const fs = require('fs');

let input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInputs = [
    `
px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = undefined;
    const lines = input.split('\n').filter((line) => line.length);

    const workflows = {};
    const items = [];
    lines.forEach((line, ix) => {
        if (line.startsWith('{')) {
            const item = {};
            for (const rating of line.replace('{', '').replace('}', '').split(',')) {
                const [label, value] = rating.split('=');
                item[label] = Number(value);
            }
            items.push(item);
        } else {
            const [label, rules] = line.split(/[{}]/);
            const workflow = [];
            workflows[label] = workflow;

            for (const rule of rules.split(',')) {
                if (rule.includes(':')) {
                    const [_, cat, op, value, target] = rule.match(/(\w)([<=>])(\d+):(\w+)/);
                    workflow.push({ cat, op, value: Number(value), target });
                } else {
                    workflow.push({ goto: rule });
                }
            }
        }
    });

    for (const item of items) {
        let workflow = workflows['in'];
        while (true) {
            let next;
            for (let rule of workflow) {
                if (rule.goto) {
                    next = rule.goto;
                } else {
                    const { cat, op, value, target } = rule;
                    const itemValue = item[cat];
                    if ((op === '<' && itemValue < value) || (op === '>' && itemValue > value)) {
                        next = target;
                        break;
                    }
                }
            }

            if (next === 'A') {
                part1 += item.x + item.m + item.a + item.s;
                break;
            } else if (next === 'R') {
                break;
            } else {
                workflow = workflows[next];
            }
        }
    }

    function countCombinations(label, ranges) {
        if (label === 'A') {
            return range(ranges.x) * range(ranges.m) * range(ranges.a) * range(ranges.s);
        } else if (label === 'R') {
            return 0;
        } else {
            let count = 0;
            let nextRanges = { ...ranges };

            for (const rule of workflows[label]) {
                if (rule.goto) {
                    count += countCombinations(rule.goto, nextRanges);
                } else {
                    const { cat, op, value, target } = rule;
                    const itemRange = nextRanges[cat];

                    if (op === '<') {
                        if (itemRange[0] < value) {
                            count += countCombinations(target, {
                                ...nextRanges,
                                [cat]: [itemRange[0], Math.min(itemRange[1], value - 1)]
                            });
                        }
                        nextRanges[cat] = [Math.max(itemRange[0], value), itemRange[1]];
                    } else if (op === '>') {
                        if (itemRange[1] > value) {
                            count += countCombinations(target, {
                                ...nextRanges,
                                [cat]: [Math.max(itemRange[0], value + 1), itemRange[1]]
                            });
                        }
                        nextRanges[cat] = [itemRange[0], Math.min(itemRange[1], value)];
                    } else {
                        throw new Error('wtf');
                    }

                    if (nextRanges[cat][0] > nextRanges[cat][1]) {
                        // can't reach
                        break;
                    }
                }
            }

            return count;
        }
    }

    part2 = countCombinations('in', { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] });

    return [part1, part2];
}

function range(a) {
    return a[1] - a[0] + 1;
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
