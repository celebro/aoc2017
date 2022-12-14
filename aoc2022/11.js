const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
Monkey 0:
Starting items: 79, 98
Operation: new = old * 19
Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
Starting items: 54, 65, 75, 74
Operation: new = old + 6
Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
Starting items: 79, 60, 97
Operation: new = old * old
Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
Starting items: 74
Operation: new = old + 3
Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1
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

    let monkeys = parse(lines);
    for (let i = 0; i < 20; i++) {
        for (const monkey of monkeys) {
            for (const item of monkey.items) {
                monkey.count++;
                const level = Math.floor(monkey.op(item) / 3);
                const target = level % monkey.test === 0 ? monkey.testMap.true : monkey.testMap.false;
                monkeys.at(target).items.push(level);
            }
            monkey.items.length = 0;
        }
    }

    monkeys.sort((a, b) => b.count - a.count);
    part1 = monkeys[0].count * monkeys[1].count;

    monkeys = parse(lines);
    let multiple = 1;
    for (const monkey of monkeys) {
        multiple *= monkey.test;
    }
    for (let i = 0; i < 10000; i++) {
        for (const monkey of monkeys) {
            for (const item of monkey.items) {
                monkey.count++;
                const level = Math.floor(monkey.op(item));
                const target = level % monkey.test === 0 ? monkey.testMap.true : monkey.testMap.false;
                monkeys.at(target).items.push(level % multiple);
            }
            monkey.items.length = 0;
        }
    }

    monkeys.sort((a, b) => b.count - a.count);
    part2 = monkeys[0].count * monkeys[1].count;

    return [part1, part2];
}

function parse(lines) {
    const monkeys = [];
    for (const l of lines) {
        const monkey = monkeys.at(-1);
        const line = l.trim();
        if (line.startsWith('Monkey')) {
            monkeys.push(new Monkey());
        } else if (line.includes('items')) {
            monkey.items = line
                .split(': ')[1]
                .split(',')
                .map((x) => +x);
        } else if (line.includes('Operation')) {
            const split = line.split(' ');
            const num = +split.at(-1);
            if (split.at(-2) === '+') {
                monkey.op = (x) => x + (num || x);
            } else {
                monkey.op = (x) => x * (num || x);
            }
        } else if (line.includes('Test')) {
            monkey.test = +line.split(' ').at(-1);
        } else if (line.includes('If')) {
            const target = line.split(' ').at(-1);
            if (line.includes('true')) {
                monkey.testMap.true = +target;
            } else {
                monkey.testMap.false = +target;
            }
        }
    }
    return monkeys;
}

class Monkey {
    items = [];
    op = undefined;
    test = 0;
    testMap = {
        true: 0,
        false: 0
    };
    count = 0;
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
