const fs = require('fs');
const sscanf = require('scan.js').scan;
// @ts-ignore
const Grid = require('../utils/Grid');
// @ts-ignore
const List = require('../utils/LinkedList');
const Computer = require('./computer');
var readlineSync = require('readline-sync');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}

const reverse = {
    east: 'west',
    west: 'east',
    north: 'south',
    south: 'north'
};

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;

    const code = input.split('\n').filter(line => line.length)[0];
    const computer = new Computer(code);
    const str = computer.mem.map(x => String.fromCharCode(Math.abs(x))).join('');

    /**
     * @param {string} id
     * @param {string} from
     */
    function createLocation(id, from, fromDirection) {
        return {
            id,
            from,
            fromDirection,
            doors: [],
            items: []
        };
    }

    /** @type {Map<string, ReturnType<createLocation>>} */
    const map = new Map();
    /** @type {Map<string, ReturnType<createLocation>>} */
    const itemMap = new Map();

    function explore(start) {
        const state = computer.saveState();
        const list = new List();

        if (!start) {
            list.enq({
                command: '',
                state: computer.saveState()
            });
        } else {
            debugger;
        }

        const blackList = ['escape pod', 'photons', 'infinite loop', 'molten lava', 'giant electromagnet'];

        while (!list.isEmpty()) {
            const { command, state, from } = list.deq();
            computer.restoreState(state);
            if (command) {
                computer.addAscii(command);
            }

            const output = computer.run();
            let strOutput = output.map(x => String.fromCodePoint(x)).join('');

            let mode = '';
            let id = '';
            let doors = [];
            let items = [];

            strOutput.split('\n').forEach(line => {
                if (line && !id) {
                    id = line;
                } else if (line === 'Doors here lead:') {
                    mode = 'doors';
                } else if (line === 'Items here:') {
                    mode = 'items';
                } else if (line === '') {
                    mode = '';
                } else if (mode === 'doors') {
                    doors.push(line.substring(2));
                } else if (mode === 'items') {
                    items.push(line.substring(2));
                }
            });

            if (map.has(id)) {
                continue;
            }
            const loc = createLocation(id, from, command);
            loc.doors.push(...doors);
            loc.items.push(...items);
            map.set(id, loc);

            // console.log(strOutput);

            for (const item of items) {
                if (blackList.indexOf(item) === -1) {
                    itemMap.set(item, loc);
                }
            }

            for (const door of doors) {
                list.enq({ command: door, state: computer.saveState(), from: id });
            }
        }

        computer.restoreState(state);
    }

    function goPickUp(item) {
        let commands = [];

        let loc = itemMap.get(item);
        while (loc && loc.from) {
            commands.push(loc.fromDirection);
            loc = map.get(loc.from);
        }
        commands.reverse();
        commands.push('take ' + item);
        for (const command of commands.slice().reverse()) {
            const r = reverse[command];
            if (r) {
                commands.push(r);
            }
        }

        // console.log(commands);
        computer.addAscii(...commands);
        computer.runGetAscii();
    }

    function goTo(id) {
        const commands = [];

        let loc = map.get(id);
        while (loc && loc.from) {
            commands.push(loc.fromDirection);
            loc = map.get(loc.from);
        }
        commands.reverse();
        computer.addAscii(...commands);
        return computer.runGetAscii();
    }

    explore(null);

    const items = [...itemMap.keys()];

    let i = 0;
    let state = new Array(items.length).fill(0);
    let selected = [];
    while (i >= 0) {
        const s = state[i];
        if (s === 0) {
            selected.push(items[i]);
            state[i] = 1;
            i++;
        } else if (s === 1) {
            selected.pop();
            state[i] = 2;
            i++;
        } else {
            state[i] = 0;
            i--;
        }

        if (s === 0) {
            const computerState = computer.saveState();
            for (const item of selected) {
                goPickUp(item);
            }
            const output = goTo('== Pressure-Sensitive Floor ==');
            if (output.indexOf('Droids on this ship are heavier') !== -1) {
                // noop
            } else if (output.indexOf('Droids on this ship are lighter') !== -1) {
                i--;
            } else {
                const match = output.match(/You should be able to get in by typing (\d+) on the keypad/);
                part1 = match[1];
                break;
            }

            computer.restoreState(computerState);
        }

        if (i === state.length) {
            i = state.length - 1;
        }
    }

    // goPickUp('coin');
    // goPickUp('mug');
    // // goPickUp('easter egg');
    // goPickUp('hypercube');
    // // goPickUp('manifold');
    // // goPickUp('pointer');
    // goPickUp('astrolabe');
    // // goPickUp('candy cane');
    // goTo('== Pressure-Sensitive Floor ==');

    return [part1];
}

const result = run(input);
console.log('result: ', result.join(' / '));
