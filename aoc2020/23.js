const fs = require('fs');
const List = require('../utils/LinkedList');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
389125467
`
].map((x) => x.trim());

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;

    const lines = input.split('\n').filter((line) => line.length);
    const nums = lines[0].split('').map(Number);

    const list1 = new List();
    for (const num of nums) {
        list1.push(num);
    }

    const node1 = moves(list1, 100);
    const result = [];
    for (let node = node1.next; node !== node1; node = node.next) {
        result.push(node.value);
    }
    part1 = result.join('');

    /////////////
    console.time('p2');
    const list2 = new List();
    for (const num of nums) {
        list2.push(num);
    }
    for (let i = nums.length + 1; i <= 1_000_000; i++) {
        list2.push(i);
    }
    const node2 = moves(list2, 10_000_000);
    part2 = node2.next.value * node2.next.next.value;
    console.timeEnd('p2');

    return [part1, part2];
}

/**
 *
 * @param {List} list
 * @param {number} moves
 */
function moves(list, moves) {
    const map = [];

    let current = list._head;
    while (current) {
        map[current.value] = current;
        current = current.next;
    }

    current = list._head;
    // Make it circular
    list._tail.next = current;

    const length = list._size;

    for (let count = 0; count < moves; count++) {
        const removedHead = current.next;
        const removedTail = removedHead.next.next;

        // Remove the 3 clockwise of current
        current.next = removedTail.next;

        // Find where to insert the removed ones
        let insertAtLabel = current.value;
        do {
            insertAtLabel = insertAtLabel - 1 || length;
        } while (insertAtLabel === removedHead.value || insertAtLabel === removedHead.next.value || insertAtLabel === removedTail.value);
        const insertAtNode = map[insertAtLabel];

        // Insert
        removedTail.next = insertAtNode.next;
        insertAtNode.next = removedHead;

        current = current.next;
    }

    return map[1];
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
