const input = 361527;

function getCoords(input) {
    let side = Math.ceil(Math.sqrt(input));
    if (side % 2 === 0) {
        side += 1;
    }
    const level = (side + 1) / 2;

    const coords = {
        x: level - 1,
        y: -(level -1) + 1
    };
    let position = (side - 2) * (side - 2) + 1;

    const directions = [
        { x: 0, y: 1 },
        { x: -1, y: 0 },
        { x: 0, y: -1 },
        { x: 1, y: 0 }
    ]

    let i = 0;
    for (; i < 4; i++) {
        let delta = i === 0 ? (side - 2) : (side - 1);
        if (position + side - 1 <= input) {
            coords.x += directions[i].x * delta;
            coords.y += directions[i].y * delta;
            position += delta;
        } else {
            break;
        }
    }

    if (i < 4) {
        coords.x += directions[i].x * (input - position);
        coords.y += directions[i].y * (input - position)
    }

    return coords;
}

function solve1(input) {
    const coords = getCoords(input);
    console.log(input, ' -> ', Math.abs(coords.x) + Math.abs(coords.y));
}

// solve1(1);
// solve1(12);
// solve1(23);
// solve1(26);
// solve1(1024);
// solve1(input);





function sumup(input) {
    let level = 0;
    let sum = 1;
    let x = 0;
    let y = 0;

    const map = new Map();
    function key(x, y) {
        return x + '_' + y;
    }
    map.set(key(0, 0), 1);

    const directions = [
        { x: 0, y: 1 },
        { x: -1, y: 0 },
        { x: 0, y: -1 },
        { x: 1, y: 0 }
    ]


    function calc(x, y) {
        let sum = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const k = key(x + i, y + j);
                if (map.has(k)) {
                    sum += map.get(k);
                }
            }
        }
        map.set(key(x, y), sum);
        return sum;
    }

    while(true) {
        level = level + 1;
        let side = 2 * level + 1;

        x = x + 1;
        let sum = calc(x, y);
        if (sum > input) {
            return sum;
        }

        for (let i = 0; i < 4; i++) {
            const direction = directions[i];
            const delta = i === 0 ? side - 2 : side - 1;

            for (let t = 0; t < delta; t++) {
                x += direction.x;
                y += direction.y;
                let sum = calc(x, y);
                if (sum > input) {
                    return sum;
                }
            }

        }
    }
}

function solve2(input) {
    console.log(input, ' -> ', sumup(input));
}

solve2(361527);
// solve2(10);
// solve2(23);
// solve2(133);
