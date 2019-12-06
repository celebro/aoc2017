const fs = require('fs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {
    console.error('failed to read file', e);
}
const testInput = `
3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,
1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,
999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99
`.trim();

/**
 *
 * @param {string} code
 * @param {number[]} input
 */
function runComputer(code, input) {
    if (!code) {
        return;
    }

    const parametersMap = {
        '1': 3,
        '2': 3,
        '3': 1,
        '4': 1,
        '5': 2,
        '6': 2,
        '7': 3,
        '8': 3,
        '99': 0
    };

    const mem = code.split(',').map(Number);
    const output = [];

    let ip = 0;
    while (true) {
        let instruction = mem[ip];
        const opcode = instruction % 100;
        instruction = (instruction / 100) | 0;

        if (opcode === 99) {
            break;
        }

        const numParameters = parametersMap[opcode];
        const parameters = [];
        for (let i = 0; i < numParameters; i++) {
            const mode = instruction % 10;
            instruction = (instruction / 10) | 0;

            const param = mem[ip + i + 1];
            let paramValue;
            switch (mode) {
                case 0:
                    paramValue = mem[param];
                    break;
                case 1:
                    paramValue = param;
                    break;
                default:
                    console.error('ERR: UNKNOWN PARAM MODE', mode);
                    process.exit(1);
            }
            parameters.push(paramValue);
        }

        let jumpTo = undefined;
        switch (opcode) {
            case 1:
                // add
                mem[mem[ip + 3]] = parameters[0] + parameters[1];
                break;
            case 2:
                // multiply
                mem[mem[ip + 3]] = parameters[0] * parameters[1];
                break;
            case 3:
                // input
                mem[mem[ip + 1]] = input.shift();
                break;
            case 4:
                // output
                output.push(parameters[0]);
                // console.log('output ::: ', parameters[0]);
                break;
            case 5:
                // jump-if-true
                if (parameters[0] !== 0) {
                    jumpTo = parameters[1];
                }
                break;
            case 6:
                // jump-if-false
                if (parameters[0] === 0) {
                    jumpTo = parameters[1];
                }
                break;
            case 7:
                // less than
                mem[mem[ip + 3]] = parameters[0] < parameters[1] ? 1 : 0;
                break;
            case 8:
                // equals
                mem[mem[ip + 3]] = parameters[0] === parameters[1] ? 1 : 0;
                break;
            default:
                debugger;
                console.error('ERR: UNKNOWN OPCODE', opcode);
                process.exit(1);
        }

        if (jumpTo == undefined) {
            ip = ip + 1 + numParameters;
        } else {
            ip = jumpTo;
        }
    }

    return output[output.length - 1];
}

console.log(runComputer(testInput, [7]));
console.log(runComputer(testInput, [8]));
console.log(runComputer(testInput, [9]));

console.log('result1: ', runComputer(input, [1]));
console.log('result2: ', runComputer(input, [5]));
