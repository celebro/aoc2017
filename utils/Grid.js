const { underline, overline } = require('./string');

module.exports = class Grid {
    constructor(emptyValueGetter) {
        this.grid = {};
        this.emptyValueGetter = emptyValueGetter;
        this.minRow = Infinity;
        this.maxRow = -Infinity;
        this.minCol = Infinity;
        this.maxCol = -Infinity;
    }

    get(col, row) {
        if (this.grid[row] !== undefined) {
            if (this.grid[row][col] != undefined) {
                return this.grid[row][col];
            }
        }

        if (this.emptyValueGetter !== undefined) {
            const emptyValue = this.emptyValueGetter(col, row);
            this.set(col, row, emptyValue);
            return emptyValue;
        }

        return undefined;
    }

    set(col, row, value) {
        if (this.grid[row] === undefined) {
            this.grid[row] = {};

            if (row > this.maxRow) {
                this.maxRow = row;
            }
            if (row < this.minRow) {
                this.minRow = row;
            }
        }

        this.grid[row][col] = value;

        if (col > this.maxCol) {
            this.maxCol = col;
        }
        if (col < this.minCol) {
            this.minCol = col;
        }
    }

    forEach(cb) {
        for (let row = this.minRow; row <= this.maxRow; row++) {
            for (let col = this.minCol; col <= this.maxCol; col++) {
                cb(this.get(col, row), col, row);
            }
        }
    }

    forSlice(col, row, cols, rows, cb) {
        for (let j = 0; j < rows; j++) {
            for (let i = 0; i < cols; i++) {
                const _col = col + i;
                const _row = row + j;
                if (_col >= this.minCol && _col <= this.maxCol && _row >= this.minRow && _row <= this.maxRow) {
                    cb(this.get(_col, _row), _col, _row);
                }
            }
        }
    }

    print(printer, pad = 1, empty = ' ') {
        const leftPad = require('../aoc2017/util/leftPad');

        const rowLabelPad = Math.max(String(this.maxRow).length, String(this.minRow).length);

        for (let row = this.minRow; row <= this.maxRow; row++) {
            let line = [];
            for (let col = this.minCol; col <= this.maxCol; col++) {
                const node = this.get(col, row);
                if (node !== undefined) {
                    line.push(leftPad(printer(node, col, row), pad));
                } else {
                    line.push(empty.repeat(pad));
                }
            }

            if (row === this.minRow) {
                let line1 = [];
                let line2 = [];
                let line3 = [];

                for (let col = this.minCol; col <= this.maxCol; col++) {
                    line1.push(leftPad(col % 100 === 0 ? ~~(col / 100) % 10 : ' ', pad));
                    line2.push(leftPad(col % 10 === 0 ? ~~(col / 10) % 10 : ' ', pad));
                    line3.push(leftPad(Math.abs(col % 10), pad));
                }
                console.log(' '.repeat(rowLabelPad + 1) + line1.join(''));
                console.log(' '.repeat(rowLabelPad + 1) + line2.join(''));
                console.log(underline(' '.repeat(rowLabelPad + 1) + line3.join('')));
            }
            console.log(leftPad(row + '', rowLabelPad, ' ') + '│' + line.join(''));
        }
        console.log('');
    }

    print2(printer, pad = 1, empty = ' ') {
        const leftPad = require('../aoc2017/util/leftPad');

        const rowLabelPad = Math.max(String(this.maxRow).length, String(this.minRow).length);

        for (let row = this.maxRow; row >= this.minRow; row--) {
            let line = [];
            for (let col = this.minCol; col <= this.maxCol; col++) {
                const node = this.get(col, row);
                if (node !== undefined) {
                    line.push(leftPad(printer(node, col, row), pad));
                } else {
                    line.push(empty.repeat(pad));
                }
            }

            console.log(leftPad(row + '', rowLabelPad, ' ') + '│' + line.join(''));

            if (row === this.minRow) {
                let line1 = [];
                let line2 = [];
                let line3 = [];

                for (let col = this.minCol; col <= this.maxCol; col++) {
                    line1.push(leftPad(col % 100 === 0 ? ~~(col / 100) % 10 : ' ', pad));
                    line2.push(leftPad(col % 10 === 0 ? ~~(col / 10) % 10 : ' ', pad));
                    line3.push(leftPad(Math.abs(col % 10), pad));
                }
                console.log(overline(' '.repeat(rowLabelPad + 1) + line3.join('')));
                console.log(' '.repeat(rowLabelPad + 1) + line2.join(''));
                console.log(' '.repeat(rowLabelPad + 1) + line1.join(''));
            }
        }
        console.log('');
    }
};
