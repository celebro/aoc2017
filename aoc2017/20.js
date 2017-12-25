const fs = require('fs');

const input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
const testInput = `
p=<-6,0,0>, v=< 3,0,0>, a=< 0,0,0>
p=<-4,0,0>, v=< 2,0,0>, a=< 0,0,0>
p=<-2,0,0>, v=< 1,0,0>, a=< 0,0,0>
p=< 3,0,0>, v=<-1,0,0>, a=< 0,0,0>
`.trim();

function manhattan(vec) {
    return Math.abs(vec.x) + Math.abs(vec.y) + Math.abs(vec.z);
}

function getMinBy(data, f) {
    const mapped = data.map(f);
    const min = Math.min(...mapped);
    return data.filter(d => f(d) === min);
}

function run(input) {
    let part1 = 0;
    let part2 = 0;

    let particles = input.split('\n').map((line, ix) => {
        const particle = { ix };

        line.split(', ').forEach(part => {
            const [t, vec] = part.split('=');
            const [x, y, z] = vec.slice(1, -1).split(',').map(Number);
            const p = { x, y, z };
            p.d = manhattan(p);
            particle[t] = p;

        })
        return particle;
    });

    const byA = getMinBy(particles, x => x.a.d)
    const byV = getMinBy(byA, x => x.v.d);
    const byP = getMinBy(byV, x => x.p.d);
    part1 = byP[0].ix;

    let i = 0;
    while (i < 500) {
        const map = new Map();
        const l1 = particles.length;

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            p.v.x += p.a.x;
            p.v.y += p.a.y;
            p.v.z += p.a.z;

            p.p.x += p.v.x;
            p.p.y += p.v.y;
            p.p.z += p.v.z;

            const key = p.p.x + '_' + p.p.y + '_' + p.p.z;
            if (map.has(key)) {
                particles[i] = null;
                particles[map.get(key)] = null;
            } else {
                map.set(key, i);
            }
        }

        particles = particles.filter(Boolean);

        if (particles.length !== l1) {
            // ... and I would walk 500 more ...
            i = 0;
        } else {
            i++;
        }
    }
    part2 = particles.length;

    return [part1, part2];
}

const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));
