let program = [2, 4, 1, 7, 7, 5, 1, 7, 4, 6, 0, 3, 5, 5, 3, 0];

function run(regA) {
    let regB = 0;
    let regC = 0;
    let output = [];

    do {
        regB = regA % 8;
        regB = regB ^ 7;
        regC = Math.trunc(regA / 2 ** regB);
        regB = regB ^ 7;
        regB = regB ^ regC % 16;
        regA = Math.trunc(regA / 2 ** 3);
        output.push(regB % 8);
    } while (regA !== 0);

    return output;
}

function rec(regA, i) {
    if (i < 0) {
        console.log(regA);
        console.log(run(regA));
        process.exit();
    }
    for (let n = 0; n < 8; n++) {
        if (regA + n === 0) {
            continue;
        }

        let out = run(regA * 8 + n);
        if (out[0] === program[i]) {
            rec(regA * 8 + n, i - 1);
        }
    }
}

rec(0, program.length - 1);
