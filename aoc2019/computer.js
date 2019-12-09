const STATE_OK = 1;
const STATE_HALT = 2;
const STATE_INPUT = 3;

module.exports = class Computer {
    /**
     *
     * @param {string} code
     * @param {number[]} [input]
     */
    static runWithInput(code, input) {
        const output = Computer.runWithInputFull(code, input);
        return output[output.length - 1];
    }

    /**
     *
     * @param {string} code
     * @param {number[]} [input]
     */
    static runWithInputFull(code, input) {
        const computer = new Computer(code);
        if (input) {
            computer.addInput(...input);
        }
        const output = computer.run();
        if (!computer.isHalted) {
            throw new Error('ERR: computer waiting for input');
        }
        return output;
    }

    constructor(code) {
        /** @type number[] */
        this.mem = code.split(',').map(Number);

        /** @type number[] */
        this.input = [];
        /** @type number[] */
        this.output = [];

        /** @type number */
        this.ip = 0;
        /** @type number */
        this.relativeBase = 0;
        /** @type number */
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
     * @private
     * @param {*} modes
     */
    getParamParser(modes) {
        const computer = this;
        return {
            /**
             * @param {number} position
             */
            read: function(position) {
                const mode = ((modes / 10 ** position) | 0) % 10;
                const param = computer.read(computer.ip + position + 1);
                if (mode === 0) {
                    return computer.read(param);
                }
                if (mode === 1) {
                    return param;
                }
                if (mode === 2) {
                    return computer.read(param + computer.relativeBase);
                }
            },
            /**
             * @param {number} position
             */
            write: function(position) {
                const mode = ((modes / 10 ** position) | 0) % 10;
                const param = computer.read(computer.ip + position + 1);
                if (mode === 0) {
                    return param;
                }
                if (mode === 1) {
                    throw new Error('ERR: immediate output parameter is illegal');
                }
                if (mode === 2) {
                    return param + computer.relativeBase;
                }
            }
        };
    }

    /**
     * @private
     * @param {number} address
     */
    read(address) {
        if (address < 0) {
            throw new Error('ERR: negative address');
        }
        let value = this.mem[address];
        return value === undefined ? 0 : value;
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
            let instruction = this.read(this.ip);
            const opcode = instruction % 100;
            const modes = (instruction / 100) | 0;
            const p = this.getParamParser(modes);

            if (opcode === 99) {
                this.state = STATE_HALT;
                break;
            }

            switch (opcode) {
                case 1: // add
                    mem[p.write(2)] = p.read(0) + p.read(1);
                    this.ip += 4;
                    break;
                case 2: // multiply
                    mem[p.write(2)] = p.read(0) * p.read(1);
                    this.ip += 4;
                    break;
                case 3: // input
                    if (this.input.length > 0) {
                        mem[p.write(0)] = this.input.shift();
                        this.ip += 2;
                    } else {
                        this.state = STATE_INPUT;
                    }
                    break;
                case 4: // output
                    this.output.push(p.read(0));
                    this.ip += 2;
                    break;
                case 5: // jump-if-true
                    if (p.read(0) !== 0) {
                        this.ip = p.read(1);
                    } else {
                        this.ip += 3;
                    }
                    break;
                case 6: // jump-if-false
                    if (p.read(0) === 0) {
                        this.ip = p.read(1);
                    } else {
                        this.ip += 3;
                    }
                    break;
                case 7: // less than
                    mem[p.write(2)] = p.read(0) < p.read(1) ? 1 : 0;
                    this.ip += 4;
                    break;
                case 8: // equals
                    mem[p.write(2)] = p.read(0) === p.read(1) ? 1 : 0;
                    this.ip += 4;
                    break;
                case 9: // adjust relative base
                    this.relativeBase = this.relativeBase + p.read(0);
                    this.ip += 2;
                    break;
                default:
                    throw new Error(`ERR: unknown opcode ${opcode}`);
            }

            if (this.state === STATE_INPUT) {
                break;
            }
        }

        return this.flushOutput();
    }

    get isHalted() {
        return this.state === STATE_HALT;
    }
};
