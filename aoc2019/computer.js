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

const STATE_OK = 1;
const STATE_HALT = 2;
const STATE_INPUT = 3;

module.exports = class Computer {
    constructor(code) {
        this.mem = code.split(',').map(Number);

        /** @type number[] */
        this.input = [];
        /** @type number[] */
        this.output = [];

        this.ip = 0;
        this.state = STATE_OK;
    }

    /**
     *
     * @param  {...number} inputValues
     */
    addInput(...inputValues) {
        this.input.push(...inputValues);
        if (this.state === STATE_INPUT) {
            this.state = STATE_OK;
        }
    }

    /**
     * @returns {number[]}
     */
    flushOutput() {
        const output = [...this.output];
        this.output.length = 0;
        return output;
    }

    /**
     * @param {number} opcode
     * @param {number} instruction
     */
    __getParameters(opcode, instruction) {
        const numParameters = parametersMap[opcode];
        const parameters = [];
        for (let i = 0; i < numParameters; i++) {
            const mode = instruction % 10;
            instruction = (instruction / 10) | 0;

            const param = this.mem[this.ip + i + 1];
            let paramValue;
            switch (mode) {
                case 0:
                    paramValue = this.mem[param];
                    break;
                case 1:
                    paramValue = param;
                    break;
                default:
                    throw new Error('ERR: unknown param mode');
            }
            parameters.push(paramValue);
        }
        return parameters;
    }

    runWithInput(input) {
        this.addInput(...input);
        const output = this.run();
        return output[output.length - 1];
    }

    run() {
        const mem = this.mem;

        if (this.state === STATE_HALT) {
            throw new Error("ERR: can't run halted computer");
        }
        if (this.state === STATE_INPUT && this.input.length === 0) {
            throw new Error("ERR: can't run without input");
        }

        while (true) {
            const ip = this.ip;
            let instruction = mem[ip];
            const opcode = instruction % 100;
            instruction = (instruction / 100) | 0;

            if (opcode === 99) {
                this.state = STATE_HALT;
                break;
            }

            const parameters = this.__getParameters(opcode, instruction);

            let jumpTo = undefined;
            switch (opcode) {
                case 1: // add
                    mem[mem[ip + 3]] = parameters[0] + parameters[1];
                    break;
                case 2: // multiply
                    mem[mem[ip + 3]] = parameters[0] * parameters[1];
                    break;
                case 3: // input
                    if (this.input.length > 0) {
                        mem[mem[ip + 1]] = this.input.shift();
                    } else {
                        this.state = STATE_INPUT;
                    }
                    break;
                case 4: // output
                    this.output.push(parameters[0]);
                    break;
                case 5: // jump-if-true
                    if (parameters[0] !== 0) {
                        jumpTo = parameters[1];
                    }
                    break;
                case 6: // jump-if-false
                    if (parameters[0] === 0) {
                        jumpTo = parameters[1];
                    }
                    break;
                case 7: // less than
                    mem[mem[ip + 3]] = parameters[0] < parameters[1] ? 1 : 0;
                    break;
                case 8: // equals
                    mem[mem[ip + 3]] = parameters[0] === parameters[1] ? 1 : 0;
                    break;
                default:
                    throw new Error('ERR: unknown opcode');
            }

            if (this.state === STATE_INPUT) {
                break;
            } else if (jumpTo == undefined) {
                this.ip = ip + 1 + parameters.length;
            } else {
                this.ip = jumpTo;
            }
        }

        return this.flushOutput();
    }

    get isHalted() {
        return this.state === STATE_HALT;
    }
};
