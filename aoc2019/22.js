const fs = require('fs');
const gcd = require('../utils/gcd');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
cut 2
deal with increment 3
`,
    `
deal with increment 7
deal into new stack
`,
    `
cut 6
deal with increment 7
deal into new stack
`,
    `
deal with increment 7
deal with increment 9
cut -2
`,
    `deal into new stack
cut -2
deal with increment 7
cut 8
cut -4
deal with increment 7
cut 3
deal with increment 9
deal with increment 3
cut -1
`
].map(x => x.trim());

const NEW = 1;
const INC = 2;
const CUT = 3;

function parse(input) {
    const operations = [];
    function addOperation(op, param = 0) {
        operations.push({ op, param });
    }

    const lines = input.split('\n').filter(line => line.length);

    lines.forEach(line => {
        if (line === 'deal into new stack') {
            addOperation(NEW, 0);
        } else if (line.startsWith('deal with increment')) {
            const increment = +line.split('deal with increment ')[1];
            addOperation(INC, increment);
        } else if (line.startsWith('cut')) {
            let cut = +line.split('cut ')[1];
            addOperation(CUT, cut);
        }
    });

    return operations;
}

function shuffle(cards, operations) {
    const numCards = cards.length;

    for (const { op, param } of operations) {
        if (op === NEW) {
            cards.reverse();
        } else if (op === INC) {
            const increment = param;
            const tmp = new Uint16Array(numCards);
            let j = 0;
            for (let i = 0; i < numCards; i++) {
                tmp[j] = cards[i];
                j = j + increment;
                if (j >= numCards) {
                    j = j - numCards;
                }
            }
            cards = tmp;
        } else if (op === CUT) {
            let cut = param;
            if (cut < 0) {
                cut = numCards + cut;
            }
            const tmp = new Uint16Array(numCards);
            tmp.set(cards.subarray(0, cut), tmp.length - cut);
            tmp.set(cards.subarray(cut));
            cards = tmp;
        }
    }

    return cards;
}

/**
 * @param {string} input
 */
function run(input, numCards = 10007, position = 2020) {
    let part1 = undefined;
    let part2 = undefined;

    const operations = parse(input);
    let cards = new Uint16Array(numCards);
    for (let i = 0; i < numCards; i++) {
        cards[i] = i;
    }

    if (numCards === 10) {
        console.log(cards.join(' '));
    }

    cards = shuffle(cards, operations);

    if (numCards === 10) {
        console.log(cards.join(' '));
    } else {
        part1 = cards.indexOf(2019);
    }

    // reduce input to f(x) = factor * x + offset (mod length)
    let factor = 1;
    let offset = 0;

    for (const { op, param } of operations) {
        if (op === NEW) {
            factor = -factor;
            offset = -offset - 1;
        } else if (op === CUT) {
            offset = offset - param;
        } else if (op === INC) {
            factor = (param * factor) % numCards;
            offset = (param * offset) % numCards;
        }
    }

    const list = [];
    for (let i = 0; i < numCards; i++) {
        let tmp = (factor * i + offset) % numCards;
        if (tmp < 0) {
            tmp = tmp + numCards;
        }
        list[tmp] = i;
    }
    // console.log(list.join('-'));
    console.log(factor, offset);

    // PART 2
    // let length = numCards === 10 ? 10 : 119315717514047;
    // let times = numCards === 10 ? 1 : 101741582076661;
    // let first = -1;

    // const repeats = new Map();
    // const mask = 2 ** 15 - 1;

    // operations.reverse();

    // for (let i = 0; i < times; i++) {
    //     for (const { op, param } of operations) {
    //         if (op === NEW) {
    //             position = length - position - 1;
    //         } else if (op === INC) {
    //             const inc = param;

    //             let idx = 0;
    //             let firstInNewLine = 0;
    //             // while (true) {
    //             //     if ((position - firstInNewLine) % inc === 0) {
    //             //         idx += (position - firstInNewLine) / inc;
    //             //         break;
    //             //     }

    //             //     idx += Math.floor((length - 1 - firstInNewLine) / inc);
    //             //     firstInNewLine = (firstInNewLine + (inc - (length % inc))) % inc;
    //             //     idx++;
    //             // }
    //             gcd(inc, length);
    //             position = idx;
    //         } else if (op === CUT) {
    //             let cut = -param;
    //             if (cut < 0) {
    //                 cut = length + cut;
    //             }
    //             position = position - cut;
    //             if (position < 0) {
    //                 position = position + length;
    //             }
    //         }
    //     }

    //     if (position === 2020) {
    //         console.log('repeated after', i);
    //     }

    //     if ((i & mask) === 0) {
    //         console.log(i);
    //     }
    // }
    ///////////////

    // if (numCards === 10) {
    //     // break;
    // } else {
    // if ((i & mask) === 0) {
    //     console.log(i, position);
    // }

    // if (first === -1) {
    //     first = position;
    // } else if (first === position) {
    //     console.log(i, position, ' === ', repeats.get(position));
    //     break;
    //     // debugger;
    // }
    // if (repeats.has(position)) {
    //     //57481683403608
    //     console.log(i, position, ' === ', repeats.get(position));
    //     debugger;
    // } else {
    //     if ((i & mask) === 0) {
    //         console.log(i, position);
    //     }
    //     repeats.set(position, i);
    // }
    // }
    // }

    part2 = position;

    return [part1, part2];
}

for (const testInput of testInputs) {
    const testResult = run(testInput, 10, 5);
    console.log('test: ', testResult.join(' / '));
}

const result = run(input);
console.log('result: ', result.join(' / '));

/*
 a = 1
 b = 0
 new = (a * old + b) % length

 */
