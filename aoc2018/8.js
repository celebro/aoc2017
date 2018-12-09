const fs = require('fs');
const sscanf = require('scan.js').scan;

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch(e) {}
const testInput = `
2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2
`
.trim()
.replace(/, /g, '\n');


function run(input) {
    let part1 = 0;
    let part2 = undefined;
    const line = input.split('\n').filter(line => line.length)[0];

    let nums = line.split(' ').map(x => +x);

    let stack = [];

    function add(ix) {
        const node = {
            children: [],
            meta: [],
            remaining: nums[ix],
            metaLength: nums[ix + 1],
        };
        stack.push(node);
        return node;
    }

    const root = add(0);
    let ix = 2;

    while (stack.length) {
        const node = stack[stack.length - 1];
        if (node.remaining) {
            node.remaining -= 1;
            const child = add(ix);
            ix += 2;
            node.children.push(child);
        } else {
            for (let i = 0; i < node.metaLength; i++) {
                part1 += nums[ix];
                node.meta.push(nums[ix]);
                ix += 1;
            }
            stack.pop();
        }
    }

    function visit(node) {
        let value = 0;
        if (node.children.length === 0) {
            value = node.meta.reduce((sum, x) => sum + x, 0);
        } else {
            value = node.meta.reduce((sum, x) => {
                if (x <= node.children.length) {
                    sum += visit(node.children[x - 1]);
                }
                return sum;
            }, 0);
        }

        return value;
    }

    part2 = visit(root);


    return [part1, part2];
}

const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));
