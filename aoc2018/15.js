const fs = require('fs');
const Grid = require('../utils/FixedGrid');
const List = require('../utils/LinkedList');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch(e) {}
const testInput = [`
#######
#.G...#
#...EG#
#.#.#G#
#..G#E#
#.....#
#######
`, `
#######
#E..EG#
#.#G.E#
#E.##E#
#G..#.#
#..E#.#
#######
`, `
#######
#E.G#.#
#.#G..#
#G.#.G#
#G..#.#
#...E.#
#######
`, `
#######
#.E...#
#.#..G#
#.###.#
#E#G#G#
#...#G#
#######
`, `
#########
#G......#
#.E.#...#
#..##..G#
#...##..#
#...#...#
#.G...G.#
#.....G.#
#########
`].map(x => x.trim())


const order = [[0, -1], [-1, 0], [1, 0], [0, 1]];

function run(input) {
    const part1 = simulate(input, 3);

    let part2;
    for (let power = 4; !part2; power++) {
        part2 = simulate(input, power);
    }

    return [part1, part2];
}

function simulate(input, attackPower) {
    let { map, players } = createWorld(input);

    let completedTurns = 0;
    let finished = false;

    while (!finished) {
        for (const player of players) {
            if (player.hp <= 0) continue; // Killed by other player in this round, filter is after round ends

            let enemy = getWeakestEnemy(player, map);

            if (!enemy) {
                let enemies = players.filter(x => x.type !== player.type && x.hp > 0);
                if (enemies.length === 0) {
                    // End simulations
                    finished = true;
                    break;
                }

                const targets = getTargets(enemies, map);
                if (targets.size === 0) {
                    continue; // Don't run search algorithm if no targets
                }

                const playerLoc = map.get(player.x, player.y);
                let nextLocation = getNextLocation(playerLoc, targets, map);
                if (nextLocation) {
                    playerLoc.player = null;
                    nextLocation.player = player;
                    player.x = nextLocation.x;
                    player.y = nextLocation.y;

                    enemy = getWeakestEnemy(player, map);
                }
            }

            if (enemy) {
                enemy.hp -= player.type === 'E' ? attackPower : 3;
                if (enemy.hp <= 0) {
                    map.get(enemy.x, enemy.y).player = null;
                    if (attackPower !== 3 && enemy.type === 'E') {
                        // For part2 stop immediately when elf is killed
                        return 0;
                    }
                }
            }
        }

        players = players.filter(x => x.hp > 0);
        if (!finished) {
            players.sort((a, b) => {
                return (a.y - b.y) || (a.x - b.x);
            });
            completedTurns++;
        }
    }

    return completedTurns * players.reduce((sum, player) => sum + player.hp, 0);
}

function createWorld(input) {
    const lines = input.split('\n').filter(line => line.length);

    let players = [];
    const map = new Grid(lines[0].length, lines.length, (x, y) => ({
            x, y,
            wall: false,
            player: null,
            steps: 0,
            from: null
    }));

    lines.forEach((line, y) => {
        line.split('').forEach((char, x) => {
            const loc = map.get(x, y);
            loc.wall = char === '#';
            if (char === 'G' || char === 'E') {
                const player = {
                    x, y,
                    type: char,
                    hp: 200
                };
                loc.player = player;
                players.push(player);
            }
        });
    });

    return { map, players };
}

function getWeakestEnemy(player, map) {
    let enemy = null;
    for (const [dx, dy] of order) {
        const loc = map.get(player.x + dx, player.y + dy);
        if (loc.player && loc.player.type !== player.type && loc.player.hp > 0) {
            if (!enemy || loc.player.hp < enemy.hp) {
                enemy = loc.player;
            }
        }
    }
    return enemy;
}

function getTargets(enemies, map) {
    const targets = new Set();
    for (const enemy of enemies) {
        for (const [dx, dy] of order) {
            const loc = map.get(enemy.x + dx, enemy.y + dy);
            if (!loc.wall && !loc.player) {
                targets.add(loc);
            }
        }
    }
    return targets;
}

function getNextLocation(playerLoc, targets, map) {
    playerLoc.steps = 0;
    playerLoc.from = null;

    const list = new List();
    list.push(playerLoc);

    const visited = new Set([playerLoc])

    let bestTarget = null;
    while (list._size > 0) {
        const curr = list.shift();
        if (bestTarget && curr.steps > bestTarget.steps) {
            break;
        }

        if (targets.has(curr)) {
            if (!bestTarget || curr.y < bestTarget.y || curr.y === bestTarget.y && curr.x < bestTarget.x) {
                bestTarget = curr;
            }
        }

        for (let i = 0; i < order.length; i++) {
            const next = map.get(curr.x + order[i][0], curr.y + order[i][1]);
            if (!next.wall && !next.player && !visited.has(next)) {
                next.steps = curr.steps + 1;
                next.from = curr;
                visited.add(next);
                list.push(next);
            }
        }
    }

    // Trace back to first neighbour
    if (bestTarget) {
        while (bestTarget.from.from) {
            bestTarget = bestTarget.from;
        }
    }

    return bestTarget;
}

function print(map) {
    map.print(x => {
        if (x.player) {
            return x.player.type;
        } else if (x.wall) {
            return '#';
        } else {
            return '.';
        }
    });
}

testInput.forEach(input => {
    const testResult = run(input);
    console.log('test: ', testResult.join(' / '));
});

console.time('time');
const result = run(input);
console.timeEnd('time');
console.log('result: ', result.join(' / '));

// low 319284
// low part2 60674
