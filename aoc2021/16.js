const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    //     `
    // D2FE28
    // `,
    //     `
    // 38006F45291200
    // `,
    `
9C0141080250320F1802104A08
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const line = input.split('\n').filter((line) => line.length)[0];

    const bits = [];
    for (const hex of line) {
        const number = parseInt(hex, 16);
        let bin = number.toString(2);
        if (bin.length < 4) {
            bin = '0'.repeat(4 - bin.length) + bin;
        }
        bits.push(...bin.split('').map((x) => +x));
    }

    const packets = parsePacket(bits, 1).packets;

    part1 = addVersionNumbers(packets);
    part2 = evaluate(packets[0]);

    return [part1, part2];
}

function addVersionNumbers(packets) {
    let sum = 0;
    for (const packet of packets) {
        sum = sum + packet.version;
        if (packet.sub.length) {
            sum = sum + addVersionNumbers(packet.sub);
        }
    }
    return sum;
}

function evaluate(packet) {
    switch (packet.type) {
        case 0: {
            let sum = 0;
            for (const child of packet.sub) {
                sum += evaluate(child);
            }
            return sum;
        }
        case 1: {
            let product = 1;
            for (const child of packet.sub) {
                product *= evaluate(child);
            }
            return product;
        }
        case 2: {
            let min = Infinity;
            for (const child of packet.sub) {
                const e = evaluate(child);
                if (e < min) {
                    min = e;
                }
            }
            return min;
        }
        case 3: {
            let max = -Infinity;
            for (const child of packet.sub) {
                const e = evaluate(child);
                if (e > max) {
                    max = e;
                }
            }
            return max;
        }
        case 4: {
            return packet.value;
        }
        case 5: {
            const a = evaluate(packet.sub[0]);
            const b = evaluate(packet.sub[1]);
            if (a > b) {
                return 1;
            }
            return 0;
        }
        case 6: {
            const a = evaluate(packet.sub[0]);
            const b = evaluate(packet.sub[1]);
            if (a < b) {
                return 1;
            }
            return 0;
        }
        case 7: {
            const a = evaluate(packet.sub[0]);
            const b = evaluate(packet.sub[1]);
            if (a == b) {
                return 1;
            }
            return 0;
        }
    }
}

/**
 *
 * @param {number[]} bits
 * @param {number} [count ]
 */
function parsePacket(bits, count) {
    let start = 0;
    const packets = [];

    while (true) {
        const packet = {
            type: 0,
            version: 0,
            value: 0,
            sub: []
        };
        packets.push(packet);

        packet.version = extractBits(bits, start, start + 3);
        packet.type = extractBits(bits, start + 3, start + 6);

        if (packet.type === 4) {
            // literal value
            start = start + 6;

            let numberBits = [];
            do {
                numberBits.push(...bits.slice(start + 1, start + 5));
                start = start + 5;
            } while (bits[start - 5] === 1);

            packet.value = parseInt(numberBits.join(''), 2);
        } else {
            // operator
            if (bits[start + 6] === 0) {
                const totalLength = extractBits(bits, start + 7, start + 7 + 15);
                start = start + 7 + 15;
                const result = parsePacket(bits.slice(start, start + totalLength));
                packet.sub = result.packets;
                start = start + totalLength;
            } else {
                const numberOfSubpackets = extractBits(bits, start + 7, start + 7 + 11);
                start = start + 7 + 11;
                const result = parsePacket(bits.slice(start), numberOfSubpackets);
                packet.sub = result.packets;
                start = start + result.start;
            }
        }

        if (count && packets.length === count) {
            break;
        }
        if (start >= bits.length) {
            break;
        }
    }

    return { packets, start };
}

function extractBits(bits, start, end) {
    const sub = bits.slice(start, end);
    return parseBits(sub);
}

function parseBits(bits) {
    return parseInt(bits.join(''), 2);
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
