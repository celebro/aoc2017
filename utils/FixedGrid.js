module.exports = class Grid {
    /**
     *
     * @param {number} width
     * @param {number} height
     * @param {any} initialValue
     * @param {any} TypedArray
     */
    constructor(width, height, initialValue, TypedArray) {
        this.grid = new TypedArray(width * height);
        this.width = width;
        this.height = height;
        if (initialValue !== undefined) {
            if (typeof initialValue === 'function') {
                this.initialValue = initialValue;
            } else {
                this.grid.fill(initialValue);
            }
        }
    }

    /**
     *
     * @param {number} col
     * @param {number} row
     */
    get(col, row) {
        const index = row * this.width + col;

        if (this.grid[index] === undefined && this.initialValue) {
            this.grid[index] = this.initialValue(col, row);
        }

        return this.grid[index];
    }

    /**
     *
     * @param {number} col
     * @param {number} row
     * @param {any} value
     */
    set(col, row, value) {
        const index = row * this.width + col;
        this.grid[index] = value;
    }

    forEach(cb) {
        for (let row = 0; row < this.width; row++) {
            for (let col = 0; col <= this.height; col++) {
                cb(this.get(col, row), col, row);
            }
        }
    }

    print(printer, pad = 1) {
        const leftPad = require('../aoc2017/util/leftPad');

        for (let row = 0; row < this.width; row++) {
            let line = [];
            for (let col = 0; col < this.height; col++) {
                const node = this.get(col, row);
                if (node !== undefined) {
                    line.push(leftPad(printer(node, col, row), pad));
                } else {
                    line.push(' '.repeat(pad));
                }
            }

            if (row === 0) {
                let line = [];
                for (let col = 0; col < this.width; col++) {
                    line.push(leftPad(col % 10, pad));
                }
                console.log('    ' + line.join(''));
            }
            console.log(leftPad(row + '', 3, ' ') + ' ' + line.join(''));
        }
        console.log('');
    }
}
