module.exports = class List {
    constructor() {
        this._head = null;
        this._tail = null;
        this._size = 0;
    }

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

    pop() {
        const tail = this._tail;
        if (tail) {
            this._tail = tail.prev;
            this._tail.next = null;
            if (this._tail === null) {
                this._head = null;
            }
            this._size -= 1;
            tail.prev = null;
            return tail.value;
        } else {
            return undefined;
        }
    }

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

    shift() {
        const head = this._head;
        if (head) {
            this._head = head.next;
            this._head.prev = null;
            if (this._head === null) {
                this._tail = null;
            }
            this._size -= 1;
            return head.value;
        } else {
            return undefined;
        }
    }

    /**
     *
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
}

function createNode(value) {
    return {
        value: value,
        next: null,
        prev: null
    };
}
