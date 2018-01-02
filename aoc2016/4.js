const fs = require('fs');

const input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInput = `
aaaaa-bbb-z-y-x-123[abxyz]
a-b-c-d-e-f-g-h-987[abcde]
not-a-real-room-404[oarel]
totally-real-room-200[decoy]
`.trim();

function decrypt(words, id) {
    const result = words
        .map(word => {
            return word
                .split('')
                .map(char => {
                    let int = char.charCodeAt(0) - 'a'.charCodeAt(0);
                    int = (int + id) % ('z'.charCodeAt(0) - 'a'.charCodeAt(0) + 1);
                    int += 'a'.charCodeAt(0);
                    return String.fromCharCode(int);
                })
                .join('');
        })
        .join(' ');
    return result;
}

function run(input) {
    let part1 = 0;
    let part2 = 0;



    input
        .split('\n')
        .filter(line => line.length)
        .map(line => {
            const parts = line.split('-');
            const names = parts.slice(0, -1);
            const [_, id, check] = parts[parts.length - 1].match(/(\d+)\[(\w+)/);

            const map = {};
            const chars = names.join('').split('');
            chars.forEach(char => {
                map[char] = (map[char] || 0) + 1;
            });

            const uniq = Array.from(new Set(chars).keys());
            const mostFreq = uniq.sort((a, b) => {
                const diff = map[b] - map[a];
                if (diff === 0) {
                    return a.charCodeAt(0) - b.charCodeAt(0);
                } else {
                    return diff;
                }
            });
            mostFreq.length = 5;

            if (check === mostFreq.join('')) {
                part1 += +id;
                const decrypted = decrypt(names, +id);
                if (decrypted.indexOf('northpole object') > -1) {
                    part2 = +id;
                }
            }
        });

    return [part1, part2];
}

const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));
