const fs = require('fs');
const sscanf = require('scan.js').scan;
// @ts-ignore
const Grid = require('../utils/Grid');
// @ts-ignore
const List = require('../utils/LinkedList');
const Queue = require('priorityqueuejs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8');
} catch(e) {}

let testInput1;
try {
    testInput1 = fs.readFileSync(__filename.replace('13.js', '13test1.txt'), 'utf8').trim();
} catch(e) {}

let testInput2;
try {
    testInput2 = fs.readFileSync(__filename.replace('13.js', '13test2.txt'), 'utf8').trim();
} catch(e) {}


function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter(line => line.length);
    const map = new Grid();
    const cartMap = new Grid();

    function print() {
        map.print((val, x, y) =>  {
            const c = cartMap.get(x, y);
            if (c) {
                return c.char;
            }
            return val;
        });
    }

    const carts = new Queue((a, b) => {
        if (a.steps !== b.steps) {
            return b.steps - a.steps;
        } else if (a.y !== b.y) {
            return b.y - a.y;
        } else {
            return b.x - a.x;
        }
    });

    lines.forEach((line, y) => {
        line.split('').forEach((char, x) => {
            if (char === '>' || char === '<') {
                map.set(x, y, '-');
                const c = { x, y, steps: 0, char, last: 'right' };
                carts.enq(c);
                cartMap.set(x, y, c);
            } else if (char === '^' || char === 'v') {
                map.set(x, y, '|');
                const c = { x, y, steps: 0, char, last: 'right' };
                carts.enq(c);
                cartMap.set(x, y, c);
            } else if (char !== ' ') {
                map.set(x, y, char);
            }
        });
    });

    let count = carts.size();
    while (!part1 || !part2) {
        const carts = [];
        cartMap.forEach(cart => {
            if (cart) {
                carts.push(cart);
            }
        });

        if (carts.length <= 1) {
            if (carts.length === 1) {
                const cart = carts[0];
                console.log(cart);
                part2 = cart.x + ',' + cart.y;
            }
            break;
        }

        carts.forEach(cart => {
            if (cart && !cart.remove) {
                // print();

                cartMap.set(cart.x, cart.y, false);

                switch (cart.char) {
                    case '>':
                        cart.x += 1;
                        break;
                    case '<':
                        cart.x -= 1;
                        break;
                    case 'v':
                        cart.y += 1;
                        break;
                    case '^':
                        cart.y -= 1;
                        break;
                }

                const collision = cartMap.get(cart.x, cart.y);
                if (collision) {
                    collision.remove = true;
                    if (!part1) {
                        part1 = cart.x + ',' + cart.y;
                    }
                    cartMap.set(cart.x, cart.y, false);
                    count -= 2;
                    return;
                }

                const position = map.get(cart.x, cart.y);
                switch (cart.char) {
                    case '<':
                        if (position === '-') {

                        } else if (position === '\\') {
                            cart.char = '^'
                        } else if (position === '/') {
                            cart.char = 'v';
                        } else if (position === '+') {
                            const last = cart.last;
                            if (last === 'right') {
                                cart.char = 'v';
                                cart.last = 'left';
                            } else if (last === 'left') {
                                cart.last = 'straight';
                            } else {
                                cart.char = '^';
                                cart.last = 'right';
                            }
                        } else {
                            console.warn('err');
                            print();
                            debugger;
                        }
                        break;
                    case '>': {
                        if (position === '-') {

                        } else if (position === '\\') {
                            cart.char = 'v';
                        } else if (position === '/') {
                            cart.char = '^'
                        } else if (position === '+') {
                            const last = cart.last;
                            if (last === 'right') {
                                cart.char = '^';
                                cart.last = 'left';
                            } else if (last === 'left') {
                                cart.last = 'straight';
                            } else {
                                cart.char = 'v';
                                cart.last = 'right';
                            }
                        } else {
                            console.warn('err');
                            print();
                            debugger
                        }
                        break;
                    }
                    case 'v':
                        if (position === '|') {

                        } else if (position === '\\') {
                            cart.char = '>';
                        } else if (position === '/') {
                            cart.char = '<'
                        } else if (position === '+') {
                            const last = cart.last;
                            if (last === 'right') {
                                cart.char = '>';
                                cart.last = 'left';
                            } else if (last === 'left') {
                                cart.last = 'straight';
                            } else {
                                cart.char = '<';
                                cart.last = 'right';
                            }
                        } else {
                            console.warn('err');
                            print();
                            debugger
                        }
                        break;
                    case '^':
                        if (position === '|') {

                        } else if (position === '\\') {
                            cart.char = '<';
                        } else if (position === '/') {
                            cart.char = '>'
                        } else if (position === '+') {
                            const last = cart.last;
                            if (last === 'right') {
                                cart.char = '<';
                                cart.last = 'left';
                            } else if (last === 'left') {
                                cart.last = 'straight';
                            } else {
                                cart.char = '>';
                                cart.last = 'right';
                            }
                        } else {
                            console.warn('err');
                            print();
                            debugger
                        }
                        break;
                }

                cartMap.set(cart.x, cart.y, cart);

                cart.steps++;
                // carts.enq(cart);

            }
        });

        // const cart = carts.deq();

    }


    return [part1, part2];
}

const testResult1 = run(testInput1);
console.log('test: ', testResult1.join(' / '));

const testResult2 = run(testInput2);
console.log('test: ', testResult2.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));
