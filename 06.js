const input = [
    0,
    5,
    10,
    0,
    11,
    14,
    13,
    4,
    11,
    8,
    8,
    7,
    1,
    4,
    12,
    11
];

let unique = true;
const set = new Map();

function hash(input) {
    return input.join(' ');
}

let count = 0;

let key = hash(input);
while (!set.has(key)) {
    set.set(key, count);

    let max = Math.max(...input);
    const index = input.indexOf(max);

    input[index] = 0;

    let i = index;
    while (max) {
        i = i + 1;
        if (i >= input.length) {
            i = 0;
        }
        input[i]++;
        max--;
    }

    key = hash(input);
    count++;
}

console.log(count);
console.log(count - set.get(key));
