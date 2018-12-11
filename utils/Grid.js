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

    print(printer, pad = 1) {
        const leftPad = require('../aoc2017/util/leftPad');

        for (let row = this.minRow; row <= this.maxRow; row++) {
            let line = [];
            for (let col = this.minCol; col <= this.maxCol; col++) {
                const node = this.get(col, row);
                if (node !== undefined) {
                    line.push(leftPad(printer(node, col, row), pad));
                } else {
                    line.push(' '.repeat(pad));
                }
            }

            if (row === this.minRow) {
                let line = [];
                for (let col = this.minCol; col <= this.maxCol; col++) {
                    line.push(leftPad(col % 10, pad));
                }
                console.log('    ' + line.join(''));
            }
            console.log(leftPad(row + '', 3, ' ') + ' ' + line.join(''));
        }
        console.log('');
    }
}
