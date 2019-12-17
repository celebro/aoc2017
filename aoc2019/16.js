const fs = require('fs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `03036732577212944063491565474664`
    //     `
    //     80871224585914546619083218645595
    // `
].map(x => x.trim());

const basePattern = [0, 1, 0, -1];
function getPattern(repeat, position) {
    let index = ((position + 1) / repeat) & 3;
    return basePattern[index];
}

function fft(phase, offset) {
    const length = phase.length;
    let next = new Int8Array(length);

    for (let repeat = 0; repeat < 100; repeat++) {
        for (let i = 0; i < length; i++) {
            let sum = 0;
            for (let j = i; j < length; j++) {
                const nextPatternValue = getPattern(i + 1, j);
                sum = sum + phase[j] * nextPatternValue;
            }
            next[i] = Math.abs(sum) % 10;
        }
        [phase, next] = [next, phase];
    }

    return +phase.slice(offset, offset + 8).join('');
}

function repeatInput(input, repeat) {
    const result = new Int8Array(input.length * repeat);
    for (let r = 1; r < repeat; r++) {
        result.set(input, r * input.length);
    }
    return result;
}

/*
    Fact: output at position i only depends on input from position i forward
    Assumption: required position to calculate is in the second half of input
        -> from half forward pattern only produces ones, meaning we need the sum
        of input from position forward. Only one loop is thus required to calc
        all number, since we can reuse sum from previous line
*/
function fft2(input, repeat, offset) {
    offset = ~~offset; // v8 speedup, (knows it's an integer?)

    let phase = repeatInput(input, repeat);
    const length = phase.length;

    for (let iteration = 0; iteration < 100; iteration++) {
        let sum = 0;
        for (let i = length - 1; i >= offset; i--) {
            sum = sum + phase[i];
            phase[i] = Math.abs(sum % 10);
        }
    }

    return phase.slice(offset, offset + 8).join('');
}

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;

    let originalInput = input
        .split('\n')
        .filter(line => line.length)[0]
        .split('')
        .map(Number);

    console.time('p1');
    part1 = fft(new Int8Array(originalInput), 0);
    console.timeEnd('p1');

    console.time('p2');
    part2 = fft2(new Int8Array(originalInput), 10000, +originalInput.slice(0, 7).join(''));
    console.timeEnd('p2');

    return [part1, part2];
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));

function print(n) {
    for (let i = 0; i < n; i++) {
        let pattern = [];
        for (let j = 0; j < n; j++) {
            let p = getPattern(i + 1, j);
            if (p < 0) {
                pattern.push(' ' + p);
            } else {
                pattern.push('  ' + p);
            }
        }
        console.log(pattern.join(''));
    }
    process.exit();
}

print(10);
