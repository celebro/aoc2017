const fs = require('fs');
const Computer = require('./computer');
var readlineSync = require('readline-sync');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('25interactive.js', '25.txt'), 'utf8').trim();
} catch (e) {}

const neighbours = {
    east: [1, 0],
    west: [-1, 0],
    south: [0, 1],
    north: [0, -1]
};

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const code = input.split('\n').filter(line => line.length)[0];
    const computer = new Computer(code);

    // const grid = new Grid(() => ({
    //     isDoor: false,
    //     isRoom: false,
    //     doors: [],
    //     items: []
    // }));

    // let x = 0;
    // let y = 0;
    while (true) {
        const output = computer.run();
        let strOutput = output.map(x => String.fromCodePoint(x)).join('');

        // let mode = 'start';
        // strOutput.split('\n').forEach(line => {
        //     if (line === 'Doors here lead:') {
        //         mode = 'doors';
        //     } else if (line === 'Items here:') {
        //         mode = 'items';
        //     } else if (line === '') {
        //         mode = '';
        //     } else if (mode === 'doors') {
        //         pos.doors.push(line.substring(2));
        //     } else if (mode === 'items') {
        //         pos.items.push(line.substring(2));
        //     }
        // });

        // pos.doors.forEach(door => {
        //     const [dx, dy] = neighbours[door];
        //     const passage = grid.get(x + dx, y + dy);
        //     passage.isDoor = true;
        // });

        console.log(strOutput);
        // grid.print((obj, xx, yy) => {
        //     if (xx === x && yy === y) {
        //         return '▣';
        //     }
        //     if (obj.isDoor) {
        //         return '░';
        //     }
        //     if (obj.isRoom) {
        //         return '█';
        //     }
        //     return ' ';
        // });

        const input = readlineSync.question('>');
        computer.addAscii(input);
    }

    return [part1, part2];
}

const result = run(input);
console.log('result: ', result.join(' / '));
