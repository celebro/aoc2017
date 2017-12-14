const fs = require('fs');

const input = fs.readFileSync('./11.txt', 'utf8').trim();

const map = {
    'n':  { y: -2, x:  0 },
    'ne': { y: -1, x:  1 },
    'se': { y:  1, x:  1 },
    's':  { y:  2, x:  0 },
    'sw': { y:  1, x: -1 },
    'nw': { y: -1, x: -1 }
};

function steps(coords) {
    return Math.abs(coords.x) + Math.max(Math.abs(coords.y / 2) - Math.abs(coords.x), 0);
}

const coords = { x: 0, y: 0 }
const data = input.split(',').map((dir) => {
    const delta = map[dir];
    coords.x += delta.x;
    coords.y += delta.y;
    return steps(coords);
});

const max = Math.max(...data);
const last = data[data.length - 1];
console.log(last, max);
