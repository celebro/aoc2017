const fs = require('fs');
const sscanf = require('scan.js').scan;
const List = require('../utils/LinkedList');

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


function runPart(numPlayers, last) {
    const players = Array(numPlayers).fill(0);
    const marbles = new List();
    marbles.push(0);

    for (let i = 1; i <= last; i++) {
        if (i % 23 === 0) {
            marbles.rotate(7);
            players[i % numPlayers] += i + marbles.pop();
            marbles.rotate(-1);
        } else {
            marbles.rotate(-1);
            marbles.push(i);
        }
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
    console.log();
})

const result = run(input);
console.log('result: ', result.join(' / '));
