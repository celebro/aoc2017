const fs = require('fs');
const sscanf = require('scan.js').scan;
// @ts-ignore
const Grid = require('../utils/Grid');
// @ts-ignore
const Queue = require('../utils/ArrayQueue');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
#########
#b.A.@.a#
#########
`,
    `
########################
#f.D.E.e.C.b.A.@.a.B.c.#
######################.#
#d.....................#
########################
`,
    `
########################
#...............b.C.D.f#
#.######################
#.....@.a.B.c.d.A.e.F.g#
########################
`,
    `
#################
#i.G..c...e..H.p#
########.########
#j.A..b...f..D.o#
########@########
#k.E..a...g..B.n#
########.########
#l.F..d...h..C.m#
#################
`,
    `
########################
#@..............ac.GI.b#
###d#e#f################
###A#B#C################
###g#h#i################
########################
`
].map(x => x.trim());

const ENTRANCE = '@';
const WALL = '#';

const codes = {
    a: 'a'.charCodeAt(0),
    z: 'z'.charCodeAt(0),
    A: 'A'.charCodeAt(0),
    Z: 'Z'.charCodeAt(0)
};
/**
 * @param {string} char
 */
function isKey(char) {
    const charCode = char.charCodeAt(0);
    return charCode >= codes.a && charCode <= codes.z;
}

/**
 * @param {string} char
 */
function isDoor(char) {
    const charCode = char.charCodeAt(0);
    return charCode >= codes.A && charCode <= codes.Z;
}

function paintDeadEnds(grid) {
    let change;
    do {
        change = false;
        grid.forEach((char, x, y) => {
            if (char === '.' || isDoor(char)) {
                let count = 0;
                for (const [dx, dy] of neighbours) {
                    if (grid.get(x + dx, y + dy) === WALL) {
                        count++;
                    }
                }
                if (count > 2) {
                    grid.set(x, y, WALL);
                    change = true;
                }
            }
        });
    } while (change);
}

function print(grid) {
    grid.print(x => (x === '#' ? '█' : x));
}

const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter(line => line.length);
    const grid = new Grid();

    /**
     * @typedef {Object} Key
     * @property {number} x
     * @property {number} y
     * @property {string} char
     * @property {{ char: string, steps: number }[]} paths
     * @property {string[]} dependencies
     * @property {string[]} keyDependencies
     */

    /**
     * @param {string} char
     * @param {number} x
     * @param {number} y
     * @returns {Key}
     */
    function createKeyObject(char, x, y) {
        return { x, y, char, paths: [], dependencies: [], keyDependencies: [] };
    }

    /** @type {Object.<string, Key>} */
    const keys = {};
    keys[ENTRANCE] = createKeyObject('@', 0, 0);

    lines.forEach((line, y) => {
        line.split('').forEach((char, x) => {
            grid.set(x, y, char);
            if (char === ENTRANCE) {
                keys[ENTRANCE].x = x;
                keys[ENTRANCE].y = y;
            }
            if (isKey(char)) {
                keys[char] = createKeyObject(char, x, y);
            }
        });
    });

    print(grid);
    paintDeadEnds(grid);
    print(grid);

    for (const key of Object.values(keys)) {
        /** @type {Queue<Node>} */
        const q = new Queue();
        q.enq({ x: key.x, y: key.y, steps: 0, from: null });

        /** @type {Grid<boolean>} */
        const visited = new Grid();
        visited.set(key.x, key.y, true);

        while (q.size() > 0) {
            const node = q.deq();
            for (const [dx, dy] of neighbours) {
                const x = node.x + dx;
                const y = node.y + dy;
                const char = grid.get(x, y);

                if (char !== WALL && !visited.get(x, y)) {
                    visited.set(x, y, true);

                    /** @type {Node} */
                    const next = { x, y, steps: node.steps + 1, from: node };
                    if (isKey(char)) {
                        processKey(key, next);
                    }

                    q.enq(next);
                }
            }
        }

        // expand transitive dependancies
        if (key.char === '@') {
            let change;
            do {
                change = false;
                for (const key of Object.values(keys)) {
                    for (const dep of key.dependencies) {
                        for (const transitiveDep of keys[dep].dependencies) {
                            if (key.dependencies.indexOf(transitiveDep) === -1) {
                                key.dependencies.push(transitiveDep);
                                change = true;
                            }
                        }
                    }
                }
            } while (change);
        }
    }

    /**
     * @typedef {Object} Node
     * @property {number} x
     * @property {number} y
     * @property {number} steps
     * @property {Node} from
     */
    /**
     * @param {Key} key
     * @param {Node} node
     */
    function processKey(key, node) {
        const targetKey = keys[grid.get(node.x, node.y)];
        if (key.dependencies.indexOf(targetKey.char) === -1 && targetKey.keyDependencies.indexOf(key.char) <= 0) {
            key.paths.push({ char: targetKey.char, steps: node.steps });
        }

        if (key.char === '@') {
            // Dependencies is a list of keys we need to traverse before getting to this key
            while (node.from.from) {
                node = node.from;
                const char = grid.get(node.x, node.y);
                if (isKey(char) || isDoor(char)) {
                    if (targetKey.dependencies.indexOf(char.toLowerCase()) === -1) {
                        targetKey.dependencies.push(char.toLowerCase());
                    }
                }
                if (isKey(char)) {
                    targetKey.keyDependencies.push(char);
                }
            }
        }
    }

    keys[ENTRANCE].paths = keys[ENTRANCE].paths.filter(x => keys[x.char].dependencies.length === 0);

    const list = Object.values(keys);

    for (const key of Object.values(keys)) {
        console.log(key.char, ' :: ', key.dependencies.join(' '), ' / ', key.paths.length);
    }
    console.log(keys);
    // door dependency !== key dependency

    // first (key) dependency is enough? all deps until the first key dep

    let path = [];
    let pathMap = {};
    let pathSteps = 0;

    let bestPath = [];
    let bestPathSteps = Infinity;

    /**
     * @param {Key} key
     */
    function allDepsVisited(key) {
        for (let i = 0; i < key.dependencies.length; i++) {
            const dep = key.dependencies[i];
            if (!pathMap[dep]) {
                return false;
            }
            if (dep === key.keyDependencies[i]) {
                // sufficient to check doors until the closest key + key
                break;
            }
        }

        return true;
    }

    let dejaVu = new Map();

    /**
     * @param {Key} from
     */
    function search(from) {
        if (path.length) {
            let dejaVuKey =
                path
                    .slice(0, path.length - 1)
                    .sort()
                    .join('') + path[path.length - 1];
            let previous = dejaVu.get(dejaVuKey);
            if (previous !== undefined) {
                if (previous <= pathSteps) {
                    return;
                }
            } else {
                dejaVu.set(dejaVuKey, pathSteps);
            }
        }

        // debugger;
        if (path.length === list.length - 1) {
            if (pathSteps < bestPathSteps) {
                bestPathSteps = pathSteps;
                bestPath = path.slice();
                console.log(bestPathSteps, bestPath.join(' '));
            }
            return;
        }

        for (const { char, steps } of from.paths) {
            if (pathMap[char]) continue;
            const key = keys[char];
            if (allDepsVisited(key) && pathSteps + steps < bestPathSteps) {
                path.push(key.char);
                pathMap[key.char] = true;
                pathSteps += steps;
                search(key);
                path.pop();
                pathMap[key.char] = false;
                pathSteps -= steps;
            }
        }
    }

    search(keys[ENTRANCE]);

    part1 = bestPathSteps;

    return [part1, part2];
}

for (const testInput of [testInputs[3]]) {
    const testResult = run(testInput);
    console.log('test: ', testResult.join(' / '));
}

const result = run(input);
console.log('result: ', result.join(' / '));
