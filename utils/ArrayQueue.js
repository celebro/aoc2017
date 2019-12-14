/**
 * @template T
 */
module.exports = class Queue {
    /**
     * @param {number} clearAfter
     */
    constructor(clearAfter = 10000) {
        this.clearAfter = clearAfter;
        this.queue = [];
        this.ix = 0;
    }

    /**
     * @param {T} value
     */
    enq(value) {
        this.queue.push(value);
    }

    /**
     * @returns {T}
     */
    deq() {
        if (this.queue.length > 0) {
            const value = this.queue[this.ix++];
            if (this.ix === this.clearAfter) {
                this.queue.splice(0, this.ix);
                this.ix = 0;
            }
            return value;
        } else {
            return undefined;
        }
    }

    /**
     * @returns {T}
     */
    peek() {
        if (this.queue.length > 0) {
            return this.queue[this.ix];
        }
    }

    /**
     * @returns {number}
     */
    size() {
        return this.queue.length - this.ix;
    }
};
