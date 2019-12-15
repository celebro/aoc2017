/**
 * @template T
 */
module.exports = class List {
    constructor() {
        this._head = null;
        this._tail = null;
        this._size = 0;
    }

    /**
     * @param {T} value
     */
    push(value) {
        const node = createNode(value);
        if (this._tail) {
            node.prev = this._tail;
            this._tail.next = node;
        } else {
            this._head = node;
        }
        this._tail = node;
        this._size += 1;
    }

    /**
     * @returns {T}
     */
    pop() {
        const tail = this._tail;
        if (tail) {
            this._tail = tail.prev;
            if (this._tail) {
                this._tail.next = null;
            } else {
                this._head = null;
            }
            this._size -= 1;
            tail.prev = null;
            return tail.value;
        } else {
            return undefined;
        }
    }

    /**
     * @param {T} value
     */
    unshift(value) {
        const node = createNode(value);
        const head = this._head;
        if (head) {
            node.next = head;
            head.prev = node;
        } else {
            this._tail = node;
        }
        this._head = node;
        this._size += 1;
    }

    /**
     * @returns {T}
     */
    shift() {
        const head = this._head;
        if (head) {
            this._head = head.next;
            if (this._head) {
                this._head.prev = null;
            } else {
                this._tail = null;
            }
            this._size -= 1;
            return head.value;
        } else {
            return undefined;
        }
    }

    /**
     * @param {number} steps
     */
    rotate(steps) {
        if (this._size <= 1) {
            return;
        }

        while (steps) {
            if (steps > 0) {
                // this.unshift(this.pop())
                const node = this._tail;
                this._tail = node.prev;
                this._tail.next = null;
                node.next = this._head;
                node.prev = null;
                this._head.prev = node;
                this._head = node;

                steps -= 1;
            } else {
                // this.push(this.shift());
                const node = this._head;
                this._head = node.next;
                this._head.prev = null;
                node.next = null;
                node.prev = this._tail;
                this._tail.next = node;
                this._tail = node;

                steps += 1;
            }
        }
    }

    isEmpty() {
        return this._size === 0;
    }
};

function createNode(value) {
    return {
        value: value,
        next: null,
        prev: null
    };
}
