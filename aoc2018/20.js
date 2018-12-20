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
const testInputs = [
    '^WNE$',
    '^ENWWW(NEEE|SSE(EE|N))$',
    '^ENNWSWW(NEWS|)SSSEEN(WNSE|)EE(SWEN|)NNN$',
    '^ESSWWN(E|NNENN(EESS(WNSE|)SSS|WWWSSSSE(SW|NNNE)))$',
    '^WSSEESWWWNW(S|NENNEEEENN(ESSSSW(NWSW|SSEN)|WSWWN(E|WWS(E|SS))))$'
];


const neighbours = [[-1, 0], [1, 0], [0, -1], [0, 1]];
const diag = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
const dirs = {
    N: [0, -1, '-'],
    S: [0, 1, '-'],
    E: [1, 0, '|'],
    W: [-1, 0, '|']
};

/**
 *
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    let line = input.split('\n').filter(line => line.length)[0].substring(1);

    const map = new Grid();
    const processed = new Set();

    for (const [x, y] of neighbours) {
        map.set(x, y, '?');
    }
    for (const [x, y] of diag) {
        map.set(x, y, '#');
    }
    map.set(0, 0, 'X');

    function print() {
        map.print((x, col, row) => {
            if (col === 0 && row === 0) {
                return 'x';
            } else {
                return x || '.';
            }
        });
    }


    function go(x, y, i, skipTo) {
        // const lastSkipTo = skipTo[skipTo.length - 1];
        // console.log('---', ' '.repeat(i) +  line.substring(i, lastSkipTo), i, skipTo.join(', '));
        while (line[i] !== '$') {
            // Eliminate duplicated recursions
            const processedKey = [x, y, i].join(',');
            if (processed.has(processedKey)) {
                break;
            }
            processed.add(processedKey);

            const char = line[i];
            i++;
            if (char === '(') {
                // Scan ahead, then start new recursions for every branch
                let lvl = 1;
                let starts = [i];
                let j = i;

                while (lvl > 0) {
                    const c = line[j];
                    if (c === '(') {
                        lvl++;
                    } else if (c === ')') {
                        lvl--;
                    } else if (lvl === 1 && c === '|') {
                        starts.push(j + 1);
                    }
                    j++;
                }

                for (const start of starts) {
                    const newSkipTo = skipTo.slice();
                    newSkipTo.push(j);
                    go(x, y, start, newSkipTo);
                }

                break;
            } else if (char === ')' || char === '|') {
                i = skipTo.pop();
            } else {
                // Handle direction
                const dir = dirs[char];
                x = x + dir[0];
                y = y + dir[1];
                map.set(x, y, dir[2]);
                x = x + dir[0];
                y = y + dir[1];

                for (const [dx, dy] of neighbours) {
                    if (!map.get(x + dx, y + dy)) {
                        map.set(x + dx, y + dy, '?');
                    }
                }
                // for (const [dx, dy] of diag) {
                //     map.set(x + dx, y + dy, '#');
                // }
            }
        }
    }

    go(0, 0, 0, [line.length - 1]);

    // map.forEach((x, col, row) => {
    //     if (x === '?') {
    //         map.set(col, row, '#');
    //     }
    // });
    // print();

    const queue = new List();
    queue.push([0, 0, 0]);
    const stepsMap = new Grid();
    stepsMap.set(0, 0, 0);

    let maxSteps = 0;
    let over1000 = 0;

    while (queue._size > 0) {
        let [x, y, steps] = queue.shift();
        steps++;
        for (const [dx, dy] of neighbours) {
            const position = map.get(x + dx, y + dy);
            const isWall = position === '#' || position === '?';
            if (!isWall) {
                const xx = x + 2 * dx;
                const yy = y + 2 * dy;
                if (stepsMap.get(xx, yy) === undefined) {
                    stepsMap.set(xx, yy, steps);
                    queue.push([xx, yy, steps]);

                    if (steps > maxSteps) {
                        maxSteps = steps;
                    }
                    if (steps >= 1000) {
                        over1000++;
                    }
                }
            }
        }
    }

    part1 = maxSteps;
    part2 = over1000;

    return [part1, part2];
}

testInputs.forEach(testInput => {
    const testResult = run(testInput.trim());
    console.log('test: ', testResult.join(' / '));
});

console.time('time');
const result = run(input);
console.timeEnd('time');
console.log('result: ', result.join(' / '));
