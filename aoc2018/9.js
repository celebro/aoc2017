const fs = require('fs');
const sscanf = require('scan.js').scan;

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch(e) {}
const testInput = `
9 players; last marble is worth 25 points
10 players; last marble is worth 1618 points
13 players; last marble is worth 7999 points
17 players; last marble is worth 1104 points
21 players; last marble is worth 6111 points
30 players; last marble is worth 5807 points
`
.trim()
.replace(/, /g, '\n');

function mod(n, MAX) {
    return ((n % MAX) + MAX) % MAX;
}

function createNode(value) {
    return {
        value: value,
        next: null,
        prev: null
    };
}

class Ring {
    constructor() {
        const node = createNode(0);
        node.next = node.prev = node;
        this.current = node;
    }

    move(steps) {
        while (steps) {
            this.current = steps > 0 ? this.current.next : this.current.prev;
            steps += steps > 0 ? -1 : 1;
        }
    }

    add(value) {
        const node = createNode(value);
        node.prev = this.current;
        node.next = this.current.next;
        this.current.next = node;
        node.next.prev = node;
        this.current = node;
    }

    remove() {
        this.current.prev.next = this.current.next;
        this.current.next.prev = this.current.prev;
        this.current = this.current.next;
    }
}

function runPart(numPlayers, last) {
    const players = Array(numPlayers).fill(0);
    const marbles = new Ring();

    let player = 1;
    for (let i = 1; i <= last; i++) {
        if (i % 23 === 0) {
            marbles.move(-7);
            players[player] += i + marbles.current.value;
            marbles.remove();
        } else {
            marbles.move(1);
            marbles.add(i);
        }
        player = mod(player + 1, numPlayers);
    }

    return Math.max(...players);
}

function run(input) {
    let part1 = undefined;
    let part2 = undefined;

    const [numPlayers, last] = sscanf(input, '%d players; last marble is worth %d points');


    console.time('part1');
    part1 = runPart(numPlayers, last);
    console.timeEnd('part1');

    console.time('part2');
    part2 = runPart(numPlayers, last * 100);
    console.timeEnd('part2');

    return [part1, part2];
}

testInput.split('\n').forEach(line => {
    const testResult = run(line);
    console.log(line + ': ', testResult.join(' / '));
})

const result = run(input);
console.log('result: ', result.join(' / '));
