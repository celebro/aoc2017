const fs = require('fs');

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
    const lines = input.split('\n').filter((line) => line.length);

    let states = [
        {
            serial: 0,
            x: 0,
            y: 0,
            z: 0,
            w: 0
        }
    ];

    function value(vars, op) {
        if (op in vars) {
            return vars[op];
        }
        return +op;
    }

    let inpCount = 0;
    lines.forEach((line, ix) => {
        console.log(ix, line, states.length);

        const [inst, op1, op2] = line.split(' ');

        if (inst === 'inp') {
            inpCount++;
            const mapMax = new Map();
            const mapMin = new Map();

            // deduplicate
            // only state.z is read after every inp instruction, deduplicate based on state.z
            // within the same z keep only largest and smallest serial
            for (const state of states) {
                // needed optimization, after each instruction z can only get reduced by dividing by 26
                if (state.z > 26 ** (15 - inpCount)) {
                    continue;
                }

                const existing = mapMax.get(state.z);
                let addToMin;
                if (!existing) {
                    mapMax.set(state.z, state);
                } else if (state.serial > existing.serial) {
                    mapMax.set(state.z, state);
                    addToMin = existing;
                } else {
                    addToMin = state;
                }

                if (addToMin) {
                    let existingMin = mapMin.get(state.z);
                    if (!existingMin || addToMin.serial < existingMin.serial) {
                        mapMin.set(state.z, addToMin);
                    }
                }
            }

            const nextStates = [];
            for (const state of [...mapMax.values(), ...mapMin.values()]) {
                for (let i = 1; i < 10; i++) {
                    const next = {
                        serial: 10 * state.serial + i,
                        x: 0,
                        y: 0,
                        z: state.z,
                        w: i
                    };
                    nextStates.push(next);
                }
            }

            states = nextStates;
        } else {
            let operation;
            switch (inst) {
                case 'inp':
                    break;
                case 'add':
                    operation = function (vars) {
                        vars[op1] = vars[op1] + value(vars, op2);
                    };
                    break;
                case 'mul':
                    operation = function (vars) {
                        vars[op1] = vars[op1] * value(vars, op2);
                    };
                    break;
                case 'div':
                    operation = function (vars) {
                        vars[op1] = (vars[op1] / value(vars, op2)) | 0;
                    };
                    break;
                case 'mod':
                    operation = function (vars) {
                        if (vars[op1] < 0) {
                            console.error('Mod < 0');
                            process.exit(1);
                        }
                        vars[op1] = vars[op1] % value(vars, op2);
                    };
                    break;
                case 'eql':
                    operation = function (vars) {
                        vars[op1] = vars[op1] === value(vars, op2) ? 1 : 0;
                    };
                    break;
            }

            for (const state of states) {
                operation(state);
            }
        }
    });

    part1 = 0;
    part2 = Infinity;
    for (const state of states) {
        if (state.z === 0 && state.serial > part1) {
            part1 = state.serial;
        }
        if (state.z === 0 && state.serial < part2) {
            part2 = state.serial;
        }
    }

    return [part1, part2];
}

const result = run(input);
console.log('result: ', result.join(' / '));
