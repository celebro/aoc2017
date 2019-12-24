const fs = require('fs');
const Computer = require('./computer');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const code = input.split('\n').filter(line => line.length)[0];

    const computers = [];
    for (let i = 0; i < 50; i++) {
        let computer = new Computer(code);
        computer.addInput(i);
        computers.push(computer);
    }

    let nat = null;
    let allWaitingCount = 0;
    while (true) {
        let allWaiting = true;
        for (const computer of computers) {
            if (computer.isWaitingInput) {
                computer.addInput(-1);
            }
            const output = computer.run({ pauseAfterOutputs: 3 });
            if (!computer.isWaitingInput) {
                allWaiting = false;
                const [id, x, y] = output;
                if (id < 50) {
                    computers[id].addInput(x, y);
                } else if (id === 255) {
                    if (part1 === undefined) {
                        part1 = y;
                    }
                    nat = [x, y];
                }
            }
        }
        allWaitingCount = allWaiting ? allWaitingCount + 1 : 0;
        if (nat && allWaitingCount === 10) {
            computers[0].addInput(nat[0], nat[1]);
            if (part2 === nat[1]) {
                break;
            }
            part2 = nat[1];
            nat = null;
        }
    }

    return [part1, part2];
}

const result = run(input);
console.log('result: ', result.join(' / '));
