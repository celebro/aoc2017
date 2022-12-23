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
Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.
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

    const blueprints = lines.map((line, ix) => {
        const [id, a, b, c, d, e, f] = sscanf(
            line,
            'Blueprint %d: Each ore robot costs %d ore. Each clay robot costs %d ore. Each obsidian robot costs %d ore and %d clay. Each geode robot costs %d ore and %d obsidian.'
        );
        const blueprint = {
            id,
            bots: [
                [a, 0, 0, 0],
                [b, 0, 0, 0],
                [c, d, 0, 0],
                [e, 0, f, 0]
            ]
        };
        return blueprint;
    });

    for (const blueprint of blueprints) {
        const quality = getQuality(blueprint, 24);
        part1 += quality * blueprint.id;
    }

    for (const blueprint of blueprints.slice(0, 3)) {
        const quality = getQuality(blueprint, 32);
        part2 *= quality;
    }

    return [part1, part2];
}

function getQuality(blueprint, minutes) {
    const ixTime = 8;
    const costs = blueprint.bots;

    const list = new List();
    list.enq([0, 0, 0, 0, 1, 0, 0, 0, 0]);
    let best = 0;

    while (!list.isEmpty()) {
        const state = list.deq();

        // magic number: 28 - trial and error. not a general solution
        // since we can create max 1 robot per minute, we can limit number of ore robots
        // to max ore cost. clay too, maybe
        for (let robotType = state[ixTime] > 28 ? 3 : 0; robotType < 4; robotType++) {
            const robotCost = costs[robotType];
            let timeToWaitForRobot = 0;

            for (let costType = 0; costType < 3; costType++) {
                const cost = robotCost[costType];
                const current = state[costType];
                const production = state[costType + 4];

                if (!cost) {
                    continue;
                } else if (!production) {
                    timeToWaitForRobot = Infinity;
                    break;
                } else {
                    timeToWaitForRobot = Math.max(timeToWaitForRobot, Math.ceil((cost - current) / production) + 1);
                }
            }

            if (timeToWaitForRobot < Infinity) {
                if (timeToWaitForRobot === 0) {
                    // debugger;
                    continue;
                }
                const nextState = [...state];
                nextState[ixTime] += timeToWaitForRobot;
                if (nextState[ixTime] > minutes) {
                    continue;
                }
                for (let i = 0; i < 4; i++) {
                    nextState[i] += nextState[i + 4] * timeToWaitForRobot - robotCost[i];
                }
                nextState[robotType + 4]++;
                list.enq(nextState);
            }
        }

        best = Math.max(best, state[3] + state[7] * (minutes - state[ixTime]));
    }

    return best;
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
