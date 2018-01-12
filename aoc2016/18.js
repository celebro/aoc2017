const fs = require('fs');

const input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();

const traps = {
    '^^.': true,
    '.^^': true,
    '^..': true,
    '..^': true
}

function run(input, rows) {
    let count = 0;

    let row = input.split('');
    for (let i = 0; i < rows; i++) {
        if (i === 0) {
            count += row.filter(a => a === '.').length;
        } else {
            let left;
            let center = '.';
            let right = row[0];

            for (let j = 0; j < row.length; j++) {
                left = center;
                center = right;
                right = row[j + 1] || '.';

                const type = traps[left + center + right] ? '^' : '.'
                if (type === '.') {
                    count += 1;
                }
                row[j] = type;
            }
        }
    }
    input.split('');

    return count;
}

const testResult = run('.^^.^.^^^^', 10);
console.log('test: ', testResult);

const result1 = run(input, 40);
const result2 = run(input, 400000);
console.log('result: ', [result1, result2].join(' / '));
