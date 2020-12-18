const fs = require('fs');
const sscanf = require('scan.js').scan;
// @ts-ignore
const Grid = require('../utils/Grid');
// @ts-ignore
const List = require('../utils/LinkedList');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
.#.
..#
###
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

class Space {
    space = {};

    minx = Infinity;
    miny = Infinity;
    minz = Infinity;
    minw = Infinity;

    maxx = -Infinity;
    maxy = -Infinity;
    maxz = -Infinity;
    maxw = -Infinity;

    get(x, y, z, w) {
        const value = this.space[x]?.[y]?.[z]?.[w];
        return value;
    }

    set(x, y, z, w, value) {
        this.minx = Math.min(this.minx, x);
        this.miny = Math.min(this.miny, y);
        this.minz = Math.min(this.minz, z);
        this.minw = Math.min(this.minw, w);

        this.maxx = Math.max(this.maxx, x);
        this.maxy = Math.max(this.maxy, y);
        this.maxz = Math.max(this.maxz, z);
        this.maxw = Math.max(this.maxw, w);

        const xx = this.space[x] || (this.space[x] = {});
        const yy = xx[y] || (xx[y] = {});
        const zz = yy[z] || (yy[z] = {});
        zz[w] = value;
    }

    // print() {
    //     for (let z = this.minz; z <= this.maxz; z++) {
    //         console.log({ z });
    //         for (let y = this.miny; y <= this.maxy; y++) {
    //             let line = [];
    //             for (let x = this.minx; x <= this.maxx; x++) {
    //                 line.push(this.get(x, y, z) === 1 ? '#' : '.');
    //             }
    //             console.log(line.join(''));
    //         }
    //         console.log();
    //     }
    //     console.log('\n########\n');
    // }
}

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter((line) => line.length);

    let space = new Space();
    let nextSpace = new Space();

    lines.forEach((line, y) => {
        line.split('').forEach((char, x) => {
            space.set(x, y, 0, 0, char === '#' ? 1 : undefined);
        });
    });

    // space.print();

    let active = 0;
    for (let i = 0; i < 6; i++) {
        active = 0;
        for (let x = space.minx - 1; x <= space.maxx + 1; x++) {
            for (let y = space.miny - 1; y <= space.maxy + 1; y++) {
                for (let z = space.minz - 1; z <= space.maxz + 1; z++) {
                    ///
                    let neighbours = 0;
                    for (let dx = -1; dx <= 1; dx++) {
                        for (let dy = -1; dy <= 1; dy++) {
                            for (let dz = -1; dz <= 1; dz++) {
                                if (dx === 0 && dy === 0 && dz === 0) {
                                    // noop
                                } else {
                                    const value = space.get(x + dx, y + dy, z + dz, 0);
                                    if (value) {
                                        neighbours++;
                                    }
                                }
                            }
                        }
                    }
                    const value = space.get(x, y, z, 0);
                    let nextValue = undefined;
                    if (value) {
                        if (neighbours === 2 || neighbours === 3) {
                            nextValue = 1;
                        }
                    } else {
                        if (neighbours === 3) {
                            nextValue = 1;
                        }
                    }
                    if (nextValue) {
                        nextSpace.set(x, y, z, 0, nextValue);
                        active++;
                    }
                }
            }
        }
        space = nextSpace;
        nextSpace = new Space();
        // space.print();
    }

    part1 = active;

    //////////////
    space = new Space();
    nextSpace = new Space();
    lines.forEach((line, y) => {
        line.split('').forEach((char, x) => {
            space.set(x, y, 0, 0, char === '#' ? 1 : undefined);
        });
    });

    console.time('time');
    for (let i = 0; i < 6; i++) {
        active = 0;
        for (let x = space.minx - 1; x <= space.maxx + 1; x++) {
            for (let y = space.miny - 1; y <= space.maxy + 1; y++) {
                for (let z = space.minz - 1; z <= space.maxz + 1; z++) {
                    for (let w = space.minw - 1; w <= space.maxw + 1; w++) {
                        ///
                        let neighbours = 0;
                        for (let dx = -1; dx <= 1; dx++) {
                            for (let dy = -1; dy <= 1; dy++) {
                                for (let dz = -1; dz <= 1; dz++) {
                                    for (let dw = -1; dw <= 1; dw++) {
                                        if (dx === 0 && dy === 0 && dz === 0 && dw === 0) {
                                            // noop
                                        } else {
                                            const value = space.get(x + dx, y + dy, z + dz, w + dw);
                                            if (value) {
                                                neighbours++;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        const value = space.get(x, y, z, w);
                        let nextValue = undefined;
                        if (value) {
                            if (neighbours === 2 || neighbours === 3) {
                                nextValue = 1;
                            }
                        } else {
                            if (neighbours === 3) {
                                nextValue = 1;
                            }
                        }
                        if (nextValue) {
                            nextSpace.set(x, y, z, w, nextValue);
                            active++;
                        }
                    }
                }
            }
        }
        space = nextSpace;
        nextSpace = new Space();
    }
    console.timeEnd('time');
    part2 = active;

    return [part1, part2];
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
