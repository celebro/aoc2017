const fs = require('fs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483
`
].map((x) => x.trim());

const order1 = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
const order2 = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = 0;
    let part2 = 0;
    const lines = input.split('\n').filter((line) => line.length);

    const hands = [];
    lines.forEach((line) => {
        const [hand, bid] = line.split(' ');

        hands.push({
            hand,
            type: getType(hand),
            bid: Number(bid)
        });
    });

    sort(hands, order1);

    for (let i = 0; i < hands.length; i++) {
        part1 += hands[i].bid * (i + 1);
        hands[i].type = getType(hands[i].hand, true);
    }

    sort(hands, order2);

    for (let i = 0; i < hands.length; i++) {
        part2 += hands[i].bid * (i + 1);
    }

    return [part1, part2];
}

function getType(hand, withJokers) {
    const count = {};

    for (const char of hand.split('')) {
        count[char] = (count[char] || 0) + 1;
    }

    let jokers = 0;
    if (withJokers) {
        jokers = count['J'] || 0;
        count['J'] = 0;
    }

    const c = Object.values(count).sort().reverse();

    if (c[0] + jokers === 5) {
        return 0;
    } else if (c[0] + jokers === 4) {
        return 1;
    } else if (c[0] + jokers === 3) {
        if (c[1] === 2) {
            return 2;
        } else {
            return 3;
        }
    } else if (c[0] + jokers === 2) {
        if (c[1] === 2) {
            return 4;
        } else {
            return 5;
        }
    } else {
        return 6;
    }
}

function sort(hands, order) {
    hands.sort((a, b) => {
        if (a.type !== b.type) {
            return b.type - a.type;
        }

        for (let i = 0; i < 5; i++) {
            if (a.hand[i] !== b.hand[i]) {
                return order.indexOf(b.hand[i]) - order.indexOf(a.hand[i]);
            }
        }

        return 0;
    });
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
