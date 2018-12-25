const fs = require('fs');
const sscanf = require('scan.js').scan;
// @ts-ignore
const Grid = require('../utils/Grid');
// @ts-ignore
const List = require('../utils/LinkedList');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch(e) {}
const testInput = `
Immune System:
17 units each with 5390 hit points (weak to radiation, bludgeoning) with an attack that does 4507 fire damage at initiative 2
989 units each with 1274 hit points (immune to fire; weak to bludgeoning, slashing) with an attack that does 25 slashing damage at initiative 3

Infection:
801 units each with 4706 hit points (weak to radiation) with an attack that does 116 bludgeoning damage at initiative 1
4485 units each with 2961 hit points (immune to radiation; weak to fire, cold) with an attack that does 12 slashing damage at initiative 4
`
.trim();


function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter(line => line.length);

    let i = -1;
    while (!part2) {
        i++;

        let all = [];
        let current = null;
        lines.forEach((line, ix) => {
            if (line === 'Immune System:') {
                current = 'immune';
            } else if (line === 'Infection:') {
                current = 'infection';
            } else {
                const [units, hp] = sscanf(line, '%d units each with %d hit points');
                let [attack, attackType, initiative] = sscanf(line.split('with an attack that does ')[1], '%d %s damage at initiative %d');

                if (current === 'immune') {
                    attack = attack + i;
                }

                let weakneslist = [];
                let immunelist = [];

                const specials = line.match(/\((.*)\)/);
                if (specials) {
                    specials[1].split('; ').forEach(s => {
                        if (s.startsWith('weak to')) {
                            let sub = s.substring(8);
                            weakneslist = sub.split(', ');
                        } else if (s.startsWith('immune to')) {
                            let sub = s.substring(10);
                            immunelist = sub.split(', ');
                        } else {
                            debugger;
                        }
                    })
                }

                all.push({
                    units,
                    hp,
                    attack,
                    attackType,
                    initiative,
                    weakneslist,
                    immunelist,
                    type: current,
                    ix: current.length + 1
                });
            }
        });

        function getDamage(attacker, target) {
            let weak = target.weakneslist.indexOf(attacker.attackType) !== -1;
            let immune = target.immunelist.indexOf(attacker.attackType) !== -1;
            let damage = attacker.units * attacker.attack;
            if (weak) {
                damage = 2 * damage;
            } else if (immune) {
                damage = 0;
            }
            return damage;
        }

        function print() {
            console.table(all);
        }


        while (true) {
            all.sort((a, b) => {
                const aeff = a.units * a.attack;
                const beff = b.units * b.attack;

                return (beff - aeff) || b.initiative - a.initiative;
            });


            let anyTarget = false;
            all.forEach(group => {
                let target = null;
                let targetDamage;
                let targetEff;
                all.forEach(other => {
                    if (other.type !== group.type && !other.chosen) {
                        let damage = getDamage(group, other);
                        let eff = other.units * other.attack;

                        if (damage > 0) {
                            if (!target || damage > targetDamage || (damage === targetDamage && eff > targetEff)) {
                                target = other;
                                targetDamage = damage
                                targetEff = eff;
                            }
                        }
                    }
                });
                group.target = target;
                if (target) {
                    // console.log('--', group.type, group.ix, target.ix, targetDamage);
                    anyTarget = true;
                    target.chosen = true;
                }
            });

            if (!anyTarget) {
                // Someone won
                break;
            }

            all.sort((a, b) => {
                return b.initiative - a.initiative;
            });

            let sumKilled = 0;
            all.forEach(group => {
                if (group.units > 0 && group.target && group.target.units > 0) {
                    const target = group.target;
                    group.target = null;
                    const damage = getDamage(group, target);
                    const killed = Math.min(Math.floor(damage / target.hp), target.units);
                    sumKilled += killed;
                    target.units = target.units - killed;

                    // console.log(group.type, group.ix, target.ix, damage, killed);
                }
                group.chosen = false;
                group.target = null;
            });

            if (sumKilled === 0) {
                // All attackers don't do enough damage to cause a single defender to die, stalemate.
                all = [];
                break;
            }

            all = all.filter(group => group.units > 0);
        }

        if (i === 0) {
            part1 = 0;
            all.forEach(group => {
                part1 += group.units;
            });
        }
        if (all[0] && all[0].type === 'immune') {
            part2 = 0;
            all.forEach(group => {
                part2 += group.units;
            });
            break;
        }
    }

    return [part1, part2];
}

const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));
