const fs = require('fs');
const List = require('../utils/LinkedList');
const Queue = require('priorityqueuejs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
#############
#...........#
###B#C#B#D###
  #A#D#C#A#
  #########
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input, p2) {
    const lines = input.split('\n').filter((line) => line.length);

    const initial = {
        l1: [],
        l2: [],
        a: [],
        ab: [],
        b: [],
        bc: [],
        c: [],
        cd: [],
        d: [],
        r1: [],
        r2: [],
        cost: 0
    };

    const locRoom = ['a', 'b', 'c', 'd'];
    const locHall = ['l1', 'l2', 'ab', 'bc', 'cd', 'r1', 'r2'];

    lines.forEach((line, ix) => {
        if (ix === 2 || ix === 3) {
            initial.a.unshift(line[3].toLowerCase());
            initial.b.unshift(line[5].toLowerCase());
            initial.c.unshift(line[7].toLowerCase());
            initial.d.unshift(line[9].toLowerCase());
        }
    });

    if (p2) {
        initial.a.splice(1, 0, 'd', 'd');
        initial.b.splice(1, 0, 'b', 'c');
        initial.c.splice(1, 0, 'a', 'b');
        initial.d.splice(1, 0, 'c', 'a');
    }

    const defs = generateDefinitions();

    function isBlocked(source, target, state) {
        const def = defs[source][target];

        for (const condition of def.cond) {
            if (state[condition].length > 0) {
                return true;
            }
        }

        return false;
    }

    const costMap = {
        a: 1,
        b: 10,
        c: 100,
        d: 1000
    };

    function cost(source, target, pod, s) {
        let steps = defs[source][target].cost;

        if (locRoom.indexOf(source) !== -1) {
            // console.log(s, source, target);
            steps += N - s[source].length;
        } else if (locRoom.indexOf(target) !== -1) {
            // console.log(s, source, target);
            steps += N - s[target].length - 1;
        }

        const costValue = steps * costMap[pod];
        return costValue;
    }

    //

    const q = new Queue((a, b) => b.cost - a.cost);
    q.enq(initial);

    const map = new Map();

    function addNext(s, source, target) {
        // @ts-ignore
        const next = structuredClone(s);
        const pod = next[source].pop();
        next[target].push(pod);
        next.cost += cost(source, target, pod, s);

        const key = JSON.stringify([next.l1, next.l2, next.a, next.b, next.c, next.d, next.r1, next.r2, next.ab, next.bc, next.cd]);
        next.key = key;

        const existing = map.get(key);
        if (existing && existing.cost <= next.cost) {
            // duplicated state, ignore it
        } else {
            map.set(key, next);
            q.enq(next);
        }
    }

    const N = p2 ? 4 : 2;

    function get(array) {
        return array[array.length - 1];
    }

    while (!q.isEmpty()) {
        const s = q.deq();

        const cached = map.get(s.key);
        if (cached && cached !== s) {
            continue;
        }

        // console.log(s);

        let done = ['a', 'b', 'c', 'd'].every((room) => s[room].length === N && s[room].every((pod) => pod === room));
        if (done) {
            // console.log(s);
            return s.cost;
        }

        for (const source of locHall) {
            const pod = get(s[source]);
            if (!pod) {
                continue;
            }

            const room = s[pod];
            if (!room.every((p) => p === pod)) {
                // can't go to room if other color pod is still in it
                continue;
            }

            if (isBlocked(source, pod, s)) {
                // can't go to room because someone is in the way
                continue;
            }

            addNext(s, source, pod);
        }

        for (const source of locRoom) {
            if (s[source].every((p) => p === source)) {
                // empty or already in place
                continue;
            }

            for (const target of locHall) {
                if (s[target].length || isBlocked(source, target, s)) {
                    continue;
                }

                addNext(s, source, target);
            }

            // TODO direct to room -- don't need, just take two discrete steps?
        }
    }
}

function generateDefinitions() {
    const defs = {
        l1: {
            a: { cost: 3, cond: ['l2'] },
            b: { cost: 5, cond: ['l2', 'ab'] },
            c: { cost: 7, cond: ['l2', 'ab', 'bc'] },
            d: { cost: 9, cond: ['l2', 'ab', 'bc', 'cd'] }
        },
        l2: {
            a: { cost: 2, cond: [] },
            b: { cost: 4, cond: ['ab'] },
            c: { cost: 6, cond: ['ab', 'bc'] },
            d: { cost: 8, cond: ['ab', 'bc', 'cd'] }
        },
        ab: {
            a: { cost: 2, cond: [] },
            b: { cost: 2, cond: [] },
            c: { cost: 4, cond: ['bc'] },
            d: { cost: 6, cond: ['bc', 'cd'] }
        },
        bc: {
            a: { cost: 4, cond: ['ab'] },
            b: { cost: 2, cond: [] },
            c: { cost: 2, cond: [] },
            d: { cost: 4, cond: ['cd'] }
        },
        cd: {
            a: { cost: 6, cond: ['ab', 'bc'] },
            b: { cost: 4, cond: ['bc'] },
            c: { cost: 2, cond: [] },
            d: { cost: 2, cond: [] }
        },
        r1: {
            a: { cost: 9, cond: ['r2', 'ab', 'bc', 'cd'] },
            b: { cost: 7, cond: ['r2', 'bc', 'cd'] },
            c: { cost: 5, cond: ['r2', 'cd'] },
            d: { cost: 3, cond: ['r2'] }
        },
        r2: {
            a: { cost: 8, cond: ['ab', 'bc', 'cd'] },
            b: { cost: 6, cond: ['bc', 'cd'] },
            c: { cost: 4, cond: ['cd'] },
            d: { cost: 2, cond: [] }
        },
        a: {
            b: { cost: 4, cond: ['ab'] },
            c: { cost: 6, cond: ['ab', 'bc'] },
            d: { cost: 8, cond: ['ab', 'bc', 'cd'] }
        },
        b: {
            c: { cost: 4, cond: ['bc'] },
            d: { cost: 6, cond: ['bc', 'cd'] }
        },
        c: {
            d: { cost: 4, cond: ['cd'] }
        },
        d: {}
    };

    // the inverse definitions
    for (const [source, def] of Object.entries(defs)) {
        for (const [target, d] of Object.entries(def)) {
            defs[target][source] = d;
        }
    }

    return defs;
}

for (const testInput of testInputs) {
    if (testInput) {
        console.log(`test: ${run(testInput)} / ${run(testInput, true)}`);
    }
}

console.log(`result: ${run(input)} / ${run(input, true)}`);
