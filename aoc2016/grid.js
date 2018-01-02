module.exports = class Grid {
    constructor(emptyValueGetter) {
        this.grid = {};
        this.emptyValueGetter = emptyValueGetter;
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
        }

        this.grid[row][col] = value;
    }
}
