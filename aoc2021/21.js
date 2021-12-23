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
Player 1 starting position: 4
Player 2 starting position: 8
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

    let _players = [];
    lines.forEach((line) => {
        const [player, position] = sscanf(line, 'Player %d starting position: %d');
        _players.push({ player, position: +position, score: 0 });
    });

    const players = structuredClone(_players);
    const dice = new Dice();

    let ix = 0;
    while (true) {
        const player = players[ix];
        let move = dice.roll() + dice.roll() + dice.roll();
        player.position = ((player.position + move - 1) % 10) + 1;
        player.score += player.position;
        if (player.score >= 1000) {
            const otherPlayer = players.find((p) => p !== player);
            part1 = otherPlayer.score * dice.count;
            break;
        }
        ix = ix === 0 ? 1 : 0;
    }

    ///////////////

    const ixPlayerOffset = 4;
    const ixReplicas = 5;
    const start = [_players[0].position, 0, _players[1].position, 0, 0, 1];

    function key(state) {
        return `${state[0]},${state[1]},${state[2]},${state[3]},${state[4]}`;
    }

    let space = new List();
    space.push(start);
    const map = new Map();

    const victories = [0, 0];
    while (!space.isEmpty()) {
        const s = space.shift();
        map.delete(key(s));

        const playerOffset = s[ixPlayerOffset];

        for (let i1 = 1; i1 <= 3; i1++) {
            for (let i2 = 1; i2 <= 3; i2++) {
                for (let i3 = 1; i3 <= 3; i3++) {
                    const newState = [...s];
                    newState[playerOffset] = ((newState[playerOffset] + i1 + i2 + i3 - 1) % 10) + 1;
                    newState[playerOffset + 1] += newState[playerOffset];
                    newState[ixPlayerOffset] = playerOffset === 0 ? 2 : 0;

                    if (newState[playerOffset + 1] >= 21) {
                        victories[playerOffset === 0 ? 0 : 1] += s[ixReplicas];
                        continue;
                    }

                    const k = key(newState);
                    const existing = map.get(k);
                    if (existing) {
                        existing[ixReplicas] += newState[ixReplicas];
                    } else {
                        map.set(k, newState);
                        space.push(newState);
                    }
                }
            }
        }
    }

    console.log(victories);
    part2 = Math.max(...victories);

    return [part1, part2];
}

class Dice {
    state = 0;
    count = 0;
    roll() {
        this.state++;
        this.count++;
        if (this.state > 100) {
            this.state -= 100;
        }
        return this.state;
    }
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
