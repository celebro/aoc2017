const { underline, overline } = require('./string');

/**
 * @template T
 */
module.exports = class Grid {
    /**
     * @param {number} width
     * @param {number} height
     * @param {T} initialValue
     * @param {any} TypedArray
     */
    constructor(width, height, initialValue, TypedArray = Array) {
        this.grid = new TypedArray(width * height);
        this.width = width;
        this.height = height;

        this.minRow = Infinity;
        this.maxRow = -Infinity;
        this.minCol = Infinity;
        this.maxCol = -Infinity;

        if (initialValue !== undefined) {
            if (typeof initialValue === 'function') {
                this.initialValue = initialValue;
            } else {
                this.grid.fill(initialValue);
            }
        }
    }

    /**
     * @param {number} col
     * @param {number} row
     * @param {boolean} [ignoreDefault]
     * @returns {T}
     */
    get(col, row, ignoreDefault) {
        const index = row * this.width + col;

        if (this.grid[index] === undefined && ignoreDefault !== true && this.initialValue) {
            this.set(col, row, this.initialValue(col, row));
        }

        return this.grid[index];
    }

    /**
     * @param {number} col
     * @param {number} row
     * @param {T} value
     */
    set(col, row, value) {
        const index = row * this.width + col;
        this.grid[index] = value;

        if (row > this.maxRow) {
            this.maxRow = row;
        }
        if (row < this.minRow) {
            this.minRow = row;
        }
        if (col > this.maxCol) {
            this.maxCol = col;
        }
        if (col < this.minCol) {
            this.minCol = col;
        }
    }

    /**
     * @callback ForEachCallback
     * @param {T} value
     * @param {number} col
     * @param {number} row
     * @returns {void}
     *
     * @param {ForEachCallback} cb
     */
    forEach(cb) {
        for (let row = 0; row <= this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                const value = this.get(col, row, true);
                if (value !== undefined) {
                    cb(value, col, row);
                }
            }
        }
    }

    /**
     * @param {number} col
     * @param {number} row
     * @param {number} cols
     * @param {number} rows
     * @param {ForEachCallback} cb
     */
    forSlice(col, row, cols, rows, cb) {
        for (let j = 0; j < rows; j++) {
            for (let i = 0; i < cols; i++) {
                const _col = col + i;
                const _row = row + j;

                if (_col < this.width && _row < this.height) {
                    cb(this.get(col + i, row + j), col + i, row + j);
                }
            }
        }
    }

    /**
     * @callback PrinterCallback
     * @param {T} value
     * @param {number} col
     * @param {number} row
     * @returns {void}s
     *
     * @param {PrinterCallback} printer
     * @param {number} pad
     */
    print(printer, pad = 1) {
        const leftPad = require('../aoc2017/util/leftPad');

        const rowLabelPad = String(this.maxRow).length;

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
                let line1 = [];
                let line2 = [];
                let line3 = [];

                for (let col = this.minCol; col <= this.maxCol; col++) {
                    line1.push(leftPad(col % 100 === 0 ? ~~(col / 100) % 10 : ' ', pad));
                    line2.push(leftPad(col % 10 === 0 ? ~~(col / 10) % 10 : ' ', pad));
                    line3.push(leftPad(col % 10, pad));
                }
                console.log(' '.repeat(rowLabelPad + 1) + line1.join(''));
                console.log(' '.repeat(rowLabelPad + 1) + line2.join(''));
                console.log(underline(' '.repeat(rowLabelPad + 1) + line3.join('')));
            }
            console.log(leftPad(row + '', rowLabelPad, ' ') + '│' + line.join(''));
        }
        console.log('');
    }

    /**
     * @param {PrinterCallback} printer
     * @param {number} pad
     */
    print2(printer, pad = 1) {
        const leftPad = require('../aoc2017/util/leftPad');

        const rowLabelPad = String(this.maxRow).length;

        for (let row = this.maxRow; row >= this.minRow; row--) {
            let line = [];
            for (let col = this.minCol; col <= this.maxCol; col++) {
                const node = this.get(col, row);
                if (node !== undefined) {
                    line.push(leftPad(printer(node, col, row), pad));
                } else {
                    line.push(' '.repeat(pad));
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
                    line3.push(leftPad(col % 10, pad));
                }
                console.log(overline(' '.repeat(rowLabelPad + 1) + line3.join('')));
                console.log(' '.repeat(rowLabelPad + 1) + line2.join(''));
                console.log(' '.repeat(rowLabelPad + 1) + line1.join(''));
            }
        }
        console.log('');
    }
};
