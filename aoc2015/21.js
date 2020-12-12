const fs = require('fs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `

`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

const shop = {
    weapons: [
        //Cost  Damage  Armor
        ['Dagger', 8, 4, 0],
        ['Shortsword', 10, 5, 0],
        ['Warhammer', 25, 6, 0],
        ['Longsword', 40, 7, 0],
        ['Greataxe', 74, 8, 0]
    ],

    armor: [
        // Cost  Damage  Armor
        ['Leather', 13, 0, 1],
        ['Chainmail', 31, 0, 2],
        ['Splintmail', 53, 0, 3],
        ['Bandedmail', 75, 0, 4],
        ['Platemail', 102, 0, 5],
        ['None', 0, 0, 0]
    ],

    rings: [
        // Cost  Damage  Armor
        ['Damage + 1', 25, 1, 0],
        ['Damage + 2', 50, 2, 0],
        ['Damage + 3', 100, 3, 0],
        ['Defense + 1', 20, 0, 1],
        ['Defense + 2', 40, 0, 2],
        ['Defense + 3', 80, 0, 3],
        ['None', 0, 0, 0]
    ]
};

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter((line) => line.length);

    const boss = {};

    lines.forEach((line) => {
        const [key, value] = line.split(': ');
        const realKey = {
            'Hit Points': 'points',
            Damage: 'damage',
            Armor: 'armor'
        }[key];
        boss[realKey] = +value;
    });

    part1 = Infinity;
    part2 = 0;

    for (const weapon of shop.weapons) {
        for (const armor of shop.armor) {
            for (let i = 0; i < shop.rings.length; i++) {
                let ring1 = shop.rings[i];
                for (let j = Math.min(i + 1, shop.rings.length - 1); j < shop.rings.length; j++) {
                    let ring2 = shop.rings[j];
                    const player = getPlayer([weapon, armor, ring1, ring2]);
                    if (player.cost < part1 || player.cost > part2) {
                        const winner = getWinner(player, boss);
                        if (winner === 'player' && player.cost < part1) {
                            part1 = player.cost;
                        }
                        if (winner === 'boss' && player.cost > part2) {
                            part2 = player.cost;
                        }
                    }
                }
            }
        }
    }

    return [part1, part2];
}

function getPlayer(items) {
    let cost = 0;
    let damage = 0;
    let armor = 0;
    for (const item of items) {
        cost += item[1];
        damage += item[2];
        armor += item[3];
    }

    return { cost, damage, armor, points: 100 };
}

function getWinner(_player, _boss) {
    // debugger;
    const player = { ..._player };
    const boss = { ..._boss };

    const playerDamage = Math.max(player.damage - boss.armor, 1);
    const bossDamage = Math.max(boss.damage - player.armor, 1);

    const playerHitsToWin = Math.ceil(boss.points / playerDamage);
    const bossHitsToWin = Math.ceil(player.points / bossDamage);

    if (playerHitsToWin <= bossHitsToWin) {
        return 'player';
    } else {
        return 'boss';
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
