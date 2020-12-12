const fs = require('fs');
const ArrayQueue = require('../utils/ArrayQueue');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.
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

    const map = {};
    const reverse = [];

    console.time('parse');
    lines.forEach((line) => {
        const [bag, contains] = line.replace('.', '').split(' bags contain ');
        const list = [];
        for (const entry of contains.split(', ')) {
            if (entry !== 'no other bags') {
                const [num, c1, c2] = entry.split(' ');
                const color = c1 + ' ' + c2;
                list.push({ num: +num, color });

                if (!reverse[color]) {
                    reverse[color] = [];
                }
                reverse[color].push(bag);
            }
        }
        map[bag] = list;
    });
    console.timeEnd('parse');

    console.time('part1');
    const set = new Set('');
    let list = new ArrayQueue();
    list.enq('shiny gold');

    while (!list.isEmpty()) {
        const bags = reverse[list.deq()] || [];
        for (const bag of bags) {
            if (!set.has(bag)) {
                set.add(bag);
                list.enq(bag);
            }
        }
    }
    part1 = set.size;
    console.timeEnd('part1');

    console.time('part2');
    function r(bag) {
        const children = map[bag];
        let sum = 1;
        for (const { num, color } of children) {
            sum += num * r(color);
        }
        return sum;
    }
    part2 = r('shiny gold') - 1;
    console.timeEnd('part2');

    return [part1, part2];
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.timeEnd('r');
console.log('result: ', result.join(' / '));
