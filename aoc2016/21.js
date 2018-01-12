const fs = require('fs');

const input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInput = `
swap position 4 with position 0
swap letter d with letter b
reverse positions 0 through 4
rotate left 1 step
move position 1 to position 4
move position 3 to position 0
rotate based on position of letter b
rotate based on position of letter d
`.trim();


function run(input, pwd, enc) {
    let part1;
    let part2 = 0;

    function go(_data, inv) {
        let data = _data.split('');

        function swap(ixa, ixb) {
            let tmp = data[ixa];
            data[ixa] = data[ixb];
            data[ixb] = tmp;
        }

        function rotate(dir, steps) {
            const ix = dir === 'right' ? data.length - steps : steps;
            const a = data.slice(0, ix);
            const b = data.slice(ix);
            data = b.concat(a);
        }

        let lines = input.split('\n').filter(line => line.length);
        if (inv) {
            lines.reverse();
        }

        lines.forEach((line, ix) => {
            if (line.startsWith('swap position')) {
                const [, ixa, ixb] = line.match(/(\d+).*(\d+)/);
                swap(ixa, ixb);
            } else if (line.startsWith('swap')) {
                const [, a, b] = line.match(/letter (\w) with letter (\w)/);
                const ixa = data.indexOf(a);
                const ixb = data.indexOf(b);
                swap(ixa, ixb);
            } else if (line.startsWith('rotate based')) {
                const [, letter] = line.match(/letter (\w)/);
                const ix = data.indexOf(letter);
                if (inv) {
                    // debugger;
                    for (let i = 0; i < data.length; i++) {
                        let target = (i + i + 1 + (i >= 4 ? 1 : 0)) % data.length;
                        if (target === ix) {
                            if (i < ix) {
                                rotate('left', ix - i);
                            } else if (i > ix) {
                                rotate('right', i - ix);
                            }
                            break;
                        }
                    }
                } else {
                    rotate('right', ix < 4 ? ix + 1 : ix + 2);
                }
            } else if (line.startsWith('rotate')) {
                const [, dir, steps] = line.match(/rotate (\w+) (\d+)/);
                let fixedDir = dir;
                if (inv) {
                    fixedDir = dir === 'left' ? 'right' : 'left';
                }
                rotate(fixedDir, +steps);
            } else if (line.startsWith('reverse')) {
                const match = line.match(/(\d)+ through (\d+)/);
                const ixa = +match[1];
                const ixb = +match[2];
                const inner = data.slice(ixa, ixb + 1);
                data.splice(ixa, ixb - ixa + 1, ...inner.reverse());
            } else if (line.startsWith('move')) {
                const match = line.match(/(\d)+ to position (\d+)/);
                let ixa = +match[1];
                let ixb = +match[2];
                if (inv) {
                    ixa = +match[2];
                    ixb = +match[1];
                }
                const letter = data[ixa];
                data.splice(ixa, 1);
                data.splice(ixb, 0, letter);
            } else {
                console.error('Failed to parse');
            }
            console.log(ix, ' - ', data.join(''))
        });

        return data.join('');
    }

    part1 = go(pwd, false);
    part2 = go(enc, true);

    return [part1, part2];
}

const testResult = run(testInput, 'abcde', 'decab'); // inverse doesn't work on this lenght, 'rotate based' is not a bijection
console.log('test: ', testResult.join(' / '));

const result = run(input, 'abcdefgh', 'fbgdceah');
console.log('result: ', result.join(' / '));
