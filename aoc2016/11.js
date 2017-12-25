console.time('time');

const fs = require('fs');

const input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInput = `
The first floor contains a hydrogen-compatible microchip and a lithium-compatible microchip.
The second floor contains a hydrogen generator.
The third floor contains a lithium generator.
The fourth floor contains nothing relevan
`.trim();

const GENERATOR = 1;
const CHIP = 2;

function log(pos, def) {
    for (let i = 4; i > 0; i--) {
        let line = [`F${i} `];
        for (let j = 0; j < pos.length; j++) {
            if (pos[j] === i) {
                if (j === 0) {
                    line.push('E  ');
                } else {
                    line.push(def[j].el + (def[j].type === GENERATOR ? 'G' : 'M') + ' ');
                }
            } else {
                line.push('.  ');
            }
        }
        console.log(line.join(''));
    }
    console.log('');
}

function parse(input, is2) {
    const def = [{ type: 'elevator', el: 'E' }];
    const initial = [1];

    const elementMap = new Map();
    let nextElement = 0;
    function add(level, type, list) {
        if (!list) {
            return;
        }

        list.forEach(el => {
            let elNum = elementMap.get(el);
            if (!elNum) {
                elNum = ++nextElement;
                elementMap.set(el, elNum);
            }
            def.push({ type, el: elNum });
            initial.push(level);
        });
    }


    input
        .split('\n')
        .filter(line => line.length)
        .map((line, ix) => {
            const generators = line.match(/\w+(?= generator)/g) || [];
            const chips = line.match(/\w+(?=-compatible)/g) || [];

            if (is2 && ix === 0) {
                generators.push('elerium', 'dilithium');
                chips.push('elerium', 'dilithium');
            }

            add(ix + 1, CHIP, chips);
            add(ix + 1, GENERATOR, generators);
        });

    return { def, initial, elements: nextElement };
}


function run(input, is2) {
    let part1 = 0;
    let part2 = 0;

    const { def, initial, elements } = parse(input, is2);
    const len = initial.length;

    function done(pos) {
        return pos.every(p => p === 4);
    }

    function isFloorSafe(pos, a, b, level, include) {
        if (level < 1 || level > 4) {
            return false;
        }

        const generators = new Array(elements);
        let generatorCount = 0;

        for (let i = 1; i < len; i++) {
            if (i === a || i === b) {
                if (!include) { continue; } // when a and b get removed from the floor
            } else if (pos[i] !== level) {
                continue;
            }

            if (def[i].type === GENERATOR) {
                generators[def[i].el] = 1;
                generatorCount++;
            }
        }

        for (let i = 1; i < len; i++) {
            if (i === a || i === b) {
                if (!include) { continue; } // when a and b get removed from the floor
            } else if (pos[i] !== level) {
                continue;
            }

            if (def[i].type === CHIP) {
                if (!generators[def[i].el] && generatorCount > 0) {
                    return false;
                }
            }
        }

        return true;
    }

    let queue = [{ pos: initial, steps: 0 }];
    let queueIx = 0;
    let count = 0;
    const set = new Set();

    while (!done(queue[queueIx].pos)) {
        const state = queue[queueIx];
        queueIx++;
        count++;
        const pos = state.pos;

        // Prevent memory exhaustion
        if ((queueIx & 524287) === 0) {
            queue = queue.slice(queueIx + 1);
            queueIx = 0;
        }

        // Eliminate duplicates
        const key = pos.join('');
        if (set.has(key)) {
            // Already visited
            continue;
        } else {
            set.add(key);
        }

        // Select one or two compatible objects, and move up / down
        const elevator = pos[0];
        for (let i = 1; i < len; i++) {
            if (pos[i] !== elevator) { continue; }

            for (let j = i; j < len; j++) {
                if (pos[j] !== elevator) { continue; }

                if (isFloorSafe(pos, i, j, elevator, false)) {
                    [1, -1].forEach(dir => {
                        if (isFloorSafe(pos, i, j, elevator + dir, true)) {
                            const copy = pos.slice();
                            copy[0] = copy[i] = copy[j] = elevator + dir;
                            queue.push({
                                pos: copy,
                                steps: state.steps + 1,
                                from: pos
                            });
                        }
                    });
                }
            }
        }
    }

    part1 = queue[queueIx].steps;
    part2 = count;

    return [part1, part2];
}

// const testResult = run(testInput);
// console.log('test: ', testResult.join(' / '));

// const result = run(input);
// console.log('result: ', result.join(' / '));
const result2 = run(input, true);
console.log('result: ', result2.join(' / '));

console.timeEnd('time');
