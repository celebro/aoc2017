const fs = require('fs');

const input = fs.readFileSync('./09.txt', 'utf8');

let junk = false;
let level = 0;
let sum = 0;
let ignore = false;
let junkCount = 0;
input.split('').forEach(char => {
    if (junk) {
        if (ignore ) {
            ignore = false;
        } else if (char === '!') {
            ignore = true;
        } else if (char === '>') {
            junk = false;
        } else {
            junkCount += 1;
        }
    } else {
        if (char === '{') {
            level += 1;
            sum += level;
        } else if (char === '}') {
            level -= 1;
        } else if (char === '<') {
            junk = true;
        }
    }
})

console.log(sum, junkCount);
