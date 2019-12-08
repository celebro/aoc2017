const fs = require('fs');
// @ts-ignore
const FixedGrid = require('../utils/FixedGrid');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}

const BLACK = 0;
const WHITE = 1;
const TRANSPARENT = 2;

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const nums = input
        .split('\n')
        .filter(line => line.length)[0]
        .split('')
        .map(Number);

    const width = 25;
    const height = 6;

    /** @type FixedGrid[] */
    const image = [];

    let x = 0;
    let y = 0;
    let layerIndex = 0;
    nums.forEach((value, ix) => {
        let layer;
        if (image.length <= layerIndex) {
            layer = new FixedGrid(width, height, 0);
            image.push(layer);
        } else {
            layer = image[layerIndex];
        }
        layer.set(x, y, value);
        x = x + 1;
        if (x === width) {
            x = 0;
            y = y + 1;
            if (y === height) {
                y = 0;
                layerIndex = layerIndex + 1;
            }
        }
    });

    let part1LayerCount;
    image.map(layer => {
        let count = [0, 0, 0];
        layer.forEach(value => {
            count[value]++;
        });

        if (!part1LayerCount || count[0] < part1LayerCount[0]) {
            part1LayerCount = count;
        }

        return count;
    });

    if (part1LayerCount) {
        part1 = part1LayerCount[1] * part1LayerCount[2];
    }

    // part2
    const final = new FixedGrid(width, height, 0);
    final.forEach((value, x, y) => {
        let finalPixel = TRANSPARENT;
        for (const layer of image) {
            const pixel = layer.get(x, y);
            if (pixel === BLACK || pixel === WHITE) {
                finalPixel = pixel;
                break;
            }
        }
        final.set(x, y, finalPixel);
    });

    const valueMap = {
        [BLACK]: '░',
        [WHITE]: '█',
        [TRANSPARENT]: ' '
    };
    final.print(x => valueMap[x]);

    return [part1, part2];
}

const result = run(input);
console.log('result: ', result.join(' / '));
