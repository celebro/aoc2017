const fs = require('fs');
// @ts-ignore
const Grid = require('../utils/FixedGrid');
// @ts-ignore

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7
`
].map((x) => x.trim());

class Board extends Grid {
    constructor(width, height, initialValue) {
        super(width, height, initialValue);
        this.reverse = [];
    }

    mark(col, row) {
        this.get(col, row).mark = true;

        let finished = true;
        for (let i = 0; i < 5; i++) {
            if (!this.get(col, i).mark) {
                finished = false;
                break;
            }
        }

        if (!finished) {
            finished = true;
            for (let i = 0; i < 5; i++) {
                if (!this.get(i, row).mark) {
                    finished = false;
                    break;
                }
            }
        }

        return finished;
    }

    getScore(draw) {
        let sum = 0;
        this.forEach(({ v, mark }) => {
            if (!mark) {
                sum += v;
            }
        });

        return sum * draw;
    }
}

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;

    const inputParts = input.split('\n\n');
    const [drawInput, ...inputBoards] = inputParts;

    const draw = drawInput.split(',').map((x) => +x);
    const boards = [];

    for (const inputBoard of inputBoards) {
        const board = new Board(5, 5, () => ({ v: 0, mark: false }));
        // @ts-ignore
        board.reverse = [];
        boards.push(board);

        // @ts-ignore
        let row = 0;
        for (const line of inputBoard.split('\n')) {
            let col = 0;
            for (const num of line.split(/ +/)) {
                if (num) {
                    board.get(col, row).v = +num;
                    board.reverse[num] = { row, col };
                    col++;
                }
            }
            row++;
        }
    }

    for (const drawNumber of draw) {
        for (let i = 0; i < boards.length; i++) {
            const board = boards[i];
            const coords = board.reverse[drawNumber];
            if (coords) {
                const finished = board.mark(coords.col, coords.row);

                if (finished) {
                    const score = board.getScore(drawNumber);
                    console.log(score);
                    if (!part1) {
                        part1 = score;
                    } else {
                        part2 = score;
                    }
                    boards.splice(i, 1);
                    i--;
                }
            }
        }
    }

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
