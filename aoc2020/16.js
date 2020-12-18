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
class: 0-1 or 4-19
row: 0-5 or 8-19
seat: 0-13 or 16-19

your ticket:
11,12,13

nearby tickets:
3,9,18
15,1,5
5,14,9
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = 1;
    const lines = input.split('\n').filter((line) => line.length);

    let mode = 'rules';
    const rules = {};
    const ticket = [];
    const nearby = [];
    lines.forEach((line, ix) => {
        if (line === 'your ticket:') {
            mode = 'ticket';
        } else if (line === 'nearby tickets:') {
            mode = 'nearby';
        } else {
            if (mode === 'rules') {
                const [key, rangesString] = line.split(': ');
                const rangeList = rangesString.split(' or ');
                const ranges = [];
                for (const range of rangeList) {
                    const [min, max] = range.split('-');
                    ranges.push({ min: +min, max: +max });
                }
                rules[key] = ranges;
            }
            if (mode === 'ticket') {
                ticket.push(...line.split(',').map((x) => +x));
            }
            if (mode === 'nearby') {
                const nearbyTicket = line.split(',').map((x) => +x);
                nearby.push(nearbyTicket);
            }
        }
    });

    const validTickets = [];
    for (const nearbyTicket of nearby) {
        let validTicket = true;
        for (const val of nearbyTicket) {
            let valid = false;
            rules: for (const rule of Object.values(rules)) {
                for (const { min, max } of rule) {
                    if (val >= min && val <= max) {
                        valid = true;
                        break rules;
                    }
                }
            }
            if (!valid) {
                part1 += val;
                validTicket = false;
            }
        }
        if (validTicket) {
            validTickets.push(nearbyTicket);
        }
    }

    ///////////

    const map = [];
    validTickets.push(ticket);

    for (const ticket of validTickets) {
        for (let i = 0; i < ticket.length; i++) {
            const val = ticket[i];
            const set = map[i] || (map[i] = new Set(Object.keys(rules)));

            for (const [key, ruleList] of Object.entries(rules)) {
                let valid = false;
                for (const { min, max } of ruleList) {
                    if (val >= min && val <= max) {
                        valid = true;
                        break;
                    }
                }
                if (!valid) {
                    set.delete(key);
                }
            }
        }
    }

    let change = false;
    do {
        change = false;
        for (const set of map) {
            if (set.size === 1) {
                const key = set.values().next().value;

                for (const otherSet of map) {
                    if (otherSet !== set && otherSet.has(key)) {
                        otherSet.delete(key);
                        change = true;
                    }
                }
            }
        }
    } while (change);

    for (let i = 0; i < map.length; i++) {
        const key = map[i].values().next().value;
        if (key.startsWith('departure')) {
            part2 *= ticket[i];
        }
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
