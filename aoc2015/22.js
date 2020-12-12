const fs = require('fs');
const PriorityQueue = require('priorityqueuejs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}

/**
 * @param {string} input
 */
function run(input, player = { points: 50, mana: 500 }) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter((line) => line.length);

    const boss = {};
    lines.forEach((line, ix) => {
        const [key, value] = line.split(': ');
        const realKey = {
            'Hit Points': 'points',
            Damage: 'damage'
        }[key];
        boss[realKey] = +value;
    });

    part1 = runPart(boss, player, false);
    part2 = runPart(boss, player, true);
    return [part1, part2];
}

function runPart(boss, player, part2) {
    let result = undefined;

    const MANA = 0;
    const PLAYERHP = 1;
    const BOSSHP = 2;
    const SHIELD = 3;
    const POISON = 4;
    const RECHARGE = 5;

    const queue = new PriorityQueue((a, b) => b.cost - a.cost);
    const initialState = [];
    initialState[MANA] = player.mana;
    initialState[PLAYERHP] = player.points;
    initialState[BOSSHP] = boss.points;
    initialState[SHIELD] = 0;
    initialState[POISON] = 0;
    initialState[RECHARGE] = 0;

    queue.enq({ cost: 0, state: initialState });

    const set = new Set();

    function runEffects(state) {
        if (state[SHIELD]) {
            state[SHIELD] -= 1;
        }
        if (state[POISON]) {
            state[BOSSHP] -= 3;
            state[POISON] -= 1;
        }
        if (state[RECHARGE]) {
            state[MANA] += 101;
            state[RECHARGE] -= 1;
        }
    }

    while (result === undefined) {
        const { cost, state } = queue.deq();

        if (part2) {
            state[PLAYERHP] -= 1;
            if (state[PLAYERHP] <= 0) {
                continue;
            }
        }

        runEffects(state);

        if (state[BOSSHP] <= 0) {
            result = cost;
            break;
        }

        for (let option = 1; option <= 5; option++) {
            const nextState = [...state];
            let manaCost;

            /* magic missile */
            if (option === 1) {
                manaCost = 53;
                nextState[BOSSHP] -= 4;
            }

            /* drain */
            if (option === 2) {
                manaCost = 73;
                nextState[BOSSHP] -= 2;
                nextState[PLAYERHP] += 2;
            }

            /* shield */
            if (option === 3 && !nextState[SHIELD]) {
                manaCost = 113;
                nextState[SHIELD] = 6;
            }

            /* poison */
            if (option === 4 && !nextState[POISON]) {
                manaCost = 173;
                nextState[POISON] = 6;
            }

            /* recharge */
            if (option === 5 && !nextState[RECHARGE]) {
                manaCost = 229;
                nextState[RECHARGE] = 5;
            }

            if (manaCost) {
                if (nextState[MANA] < manaCost) {
                    break;
                }
                nextState[MANA] -= manaCost;

                // boss turn
                runEffects(nextState);

                if (nextState[BOSSHP] <= 0) {
                    result = cost + manaCost;
                    break;
                }

                let armor = nextState[SHIELD] ? 7 : 0;
                let damage = Math.max(boss.damage - armor, 1);
                nextState[PLAYERHP] -= damage;

                if (nextState[PLAYERHP] > 0) {
                    // will continue next turn
                    const key = nextState.join(',');
                    if (!set.has(key)) {
                        set.add(key);
                        queue.enq({ cost: cost + manaCost, state: nextState });
                    }
                }
            }
        }
    }
    return result;
}

const result = run(input);
console.log('result: ', result.join(' / '));
