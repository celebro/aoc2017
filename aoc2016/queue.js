module.exports = class Queue {
    constructor(clearAfter = 10000) {
        this.clearAfter = clearAfter;
        this.queue = [];
        this.ix = 0;
    }

    enq(value) {
        this.queue.push(value);
    }

    deq() {
        if (this.queue.length > 0) {
            const value = this.queue[this.ix++];
            if (this.ix === this.clearAfter) {
                this.queue.splice(0, this.ix);
            }
            return value;
        } else {
            return undefined;
        }
    }

    size() {
        return this.queue.length - this.ix;
    }
}
