function run() {
    let part1 = 0;

    let state = 'A';
    let ix = 0;
    let tape = {};

    for (let i = 0; i < 12994925; i++) {
        let value = tape[ix] || 0;
        switch (state) {
            case 'A':
                if (value === 0) {
                    tape[ix] = 1;
                    ix++;
                    state = 'B';
                } else {
                    tape[ix] = 0;
                    ix--;
                    state = 'F';
                }
                break;
            case 'B':
                if (value === 0) {
                    tape[ix] = 0;
                    ix++;
                    state = 'C';
                } else {
                    tape[ix] = 0;
                    ix++;
                    state = 'D';
                }
                break;
            case 'C':
                if (value === 0) {
                    tape[ix] = 1;
                    ix--;
                    state = 'D';
                } else {
                    tape[ix] = 1;
                    ix++;
                    state = 'E';
                }
                break;
            case 'D':
                if (value === 0) {
                    tape[ix] = 0;
                    ix--;
                    state = 'E';
                } else {
                    tape[ix] = 0;
                    ix--;
                    state = 'D';
                }
                break;
            case 'E':
                if (value === 0) {
                    tape[ix] = 0;
                    ix++;
                    state = 'A';
                } else {
                    tape[ix] = 1;
                    ix++;
                    state = 'C';
                }
                break;
            case 'F':
                if (value === 0) {
                    tape[ix] = 1;
                    ix--;
                    state = 'A';
                } else {
                    tape[ix] = 1;
                    ix++;
                    state = 'A';
                }
                break;
        }
    }

    part1 = Object.keys(tape).filter(a => tape[a] === 1).length
    return [part1];
}

const result = run();
console.log('result: ', result.join(' / '));
