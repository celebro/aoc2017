const fs = require('fs');
const List = require('../utils/LinkedList');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
Player 1:
9
2
6
3
1

Player 2:
5
8
4
7
10
`
].map((x) => x.trim());

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter((line) => line.length);

    let player;
    const deck = [[], []];
    lines.forEach((line) => {
        if (line.startsWith('Player')) {
            player = +line[7];
        } else {
            deck[player - 1].push(+line);
        }
    });

    let deck2 = [[...deck[0]], [...deck[1]]];

    while (deck[0].length && deck[1].length) {
        let a = deck[0].shift();
        let b = deck[1].shift();
        if (a > b) {
            deck[0].push(a);
            deck[0].push(b);
        } else {
            deck[1].push(b);
            deck[1].push(a);
        }
    }

    const winnerDeck = deck[0].length ? deck[0] : deck[1];
    part1 = count(winnerDeck);

    /**
     * @param {[number[], number[]]} deck
     */
    function game(deck) {
        const visited = new Set();

        while (deck[0].length && deck[1].length) {
            const key = deck[0].join(',') + '#' + deck[1].join(',');
            if (visited.has(key)) {
                return { winner: 0 };
            }
            visited.add(key);

            let a = deck[0].shift();
            let b = deck[1].shift();

            let winner;
            if (a <= deck[0].length && b <= deck[1].length) {
                winner = game([deck[0].slice(0, a), deck[1].slice(0, b)]).winner;
            } else if (a > b) {
                winner = 0;
            } else {
                winner = 1;
            }

            if (winner === 0) {
                deck[0].push(a);
                deck[0].push(b);
            } else {
                deck[1].push(b);
                deck[1].push(a);
            }
        }

        if (deck[0].length) {
            return { winner: 0, winnerDeck: deck[0] };
        } else {
            return { winner: 1, winnerDeck: deck[1] };
        }
    }

    // @ts-ignore
    const result = game(deck2);
    part2 = count(result.winnerDeck);

    return [part1, part2];
}

function count(deck) {
    let result = 0;
    for (let i = 0; i < deck.length; i++) {
        result += (deck.length - i) * deck[i];
    }

    return result;
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
