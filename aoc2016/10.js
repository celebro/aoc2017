const fs = require('fs');

const input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInput = `
value 5 goes to bot 2
bot 2 gives low to bot 1 and high to bot 0
value 3 goes to bot 1
bot 1 gives low to output 1 and high to bot 0
bot 0 gives low to output 2 and high to output 0
value 2 goes to bot 2
`.trim();

function run(input, lowCheck, highCheck) {
    let part1 = 0;
    let part2 = 0;

    const rules = {};
    const bots = {};
    const outputs = {};

    const isFull = [];

    input
        .split('\n')
        .filter(line => line.length)
        .forEach((line) => {
            if (line.startsWith('value')) {
                const [, value, bot] = line.match(/value (\d+) goes to bot (\d+)/);
                const bin = bots[bot] || (bots[bot] = []);
                bin.push(+value);

                if (bin.length === 2) {
                    isFull.push(bot);
                }
            } else {
                const [, bot, lowType, lowIx, highType, highIx] = line.match(/bot (\d+) gives low to (\w+) (\d+) and high to (\w+) (\d+)/);

                rules[bot] = { lowType, lowIx, highType, highIx };
            }
        });

    function give(num, targetType, targetIx) {
        let store;
        if (targetType === 'bot') {
            store = bots;
        } else {
            store = outputs;
        }

        const bin = store[targetIx] || (store[targetIx] = []);
        bin.push(num);

        if (targetType === 'bot' && bin.length === 2) {
            isFull.push(targetIx);
        }
    }

    while (isFull.length > 0) {
        const bot = isFull.pop();
        const bin = bots[bot];
        const low = Math.min(...bin);
        const high = Math.max(...bin);

        if (low === lowCheck && high === highCheck) {
            part1 = bot;
        }

        const rule = rules[bot];
        give(low, rule.lowType, rule.lowIx);
        give(high, rule.highType, rule.highIx);

        bin.length = 0;
    }

    console.log(bots);

    part2 = 1;
    [0, 1, 2].forEach(outputIx => {
        const bin = outputs[outputIx];
        bin && bin.forEach(value => {
            part2 = part2 * value;
        });
    })

    return [part1, part2];
}

const testResult = run(testInput, 2, 5);
console.log('test: ', testResult.join(' / '));

const result = run(input, 17, 61);
console.log('result: ', result.join(' / '));
