const fs = require('fs');
const sscanf = require('scan.js').scan;
const Grid = require('../utils/Grid');
const List = require('../utils/LinkedList');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
--- scanner 0 ---
404,-588,-901
528,-643,409
-838,591,734
390,-675,-793
-537,-823,-458
-485,-357,347
-345,-311,381
-661,-816,-575
-876,649,763
-618,-824,-621
553,345,-567
474,580,667
-447,-329,318
-584,868,-557
544,-627,-890
564,392,-477
455,729,728
-892,524,684
-689,845,-530
423,-701,434
7,-33,-71
630,319,-379
443,580,662
-789,900,-551
459,-707,401

--- scanner 1 ---
686,422,578
605,423,415
515,917,-361
-336,658,858
95,138,22
-476,619,847
-340,-569,-846
567,-361,727
-460,603,-452
669,-402,600
729,430,532
-500,-761,534
-322,571,750
-466,-666,-811
-429,-592,574
-355,545,-477
703,-491,-529
-328,-685,520
413,935,-424
-391,539,-444
586,-435,557
-364,-763,-893
807,-499,-711
755,-354,-619
553,889,-390

--- scanner 2 ---
649,640,665
682,-795,504
-784,533,-524
-644,584,-595
-588,-843,648
-30,6,44
-674,560,763
500,723,-460
609,671,-379
-555,-800,653
-675,-892,-343
697,-426,-610
578,704,681
493,664,-388
-671,-858,530
-667,343,800
571,-461,-707
-138,-166,112
-889,563,-600
646,-828,498
640,759,510
-630,509,768
-681,-892,-333
673,-379,-804
-742,-814,-386
577,-820,562

--- scanner 3 ---
-589,542,597
605,-692,669
-500,565,-823
-660,373,557
-458,-679,-417
-488,449,543
-626,468,-788
338,-750,-386
528,-832,-391
562,-778,733
-938,-730,414
543,643,-506
-524,371,-870
407,773,750
-104,29,83
378,-903,-323
-778,-728,485
426,699,580
-438,-605,-362
-469,-447,-387
509,732,623
647,635,-688
-868,-804,481
614,-800,639
595,780,-596

--- scanner 4 ---
727,592,562
-293,-554,779
441,611,-461
-714,465,-776
-743,427,-804
-660,-479,-426
832,-632,460
927,-485,-438
408,393,-506
466,436,-512
110,16,151
-258,-428,682
-393,719,612
-211,-452,876
808,-476,-593
-575,615,604
-485,667,467
-680,325,-822
-627,-443,-432
872,-547,-609
833,512,582
807,604,487
839,-516,451
891,-625,532
-652,-548,-490
30,-46,-14
`
].map((x) => x.trim());

// const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter((line) => line.length);

    const rotations = generateRotationMatrices();

    let scanners = [];
    let scanner;

    lines.forEach((line, ix) => {
        if (line.startsWith('---')) {
            scanner = rotations.map(() => ({
                beacons: [],
                set: null
            }));
            scanners.push(scanner);
        } else {
            const vector = sscanf(line, '%d,%d,%d');
            for (let i = 0; i < rotations.length; i++) {
                const v = rotate(vector, rotations[i]);
                scanner[i].beacons.push(v);
            }
        }
    });

    const initial = scanners.shift()[0];
    initial.set = new Set(initial.beacons.map((x) => x.join(',')));
    const fixed = [initial];

    while (scanners.length) {
        console.log('find scanner', scanners.length);
        let i = 0;
        const toRemove = [];
        for (const test of scanners) {
            console.log('testing', i);
            const rotation = getMatchingRotation(test, fixed);
            if (rotation) {
                toRemove.push(test);
                fixed.push(rotation);
            }
            i++;
        }
        scanners = scanners.filter((x) => toRemove.indexOf(x) === -1);
    }

    const beacons = new Set();
    for (const fixedRotation of fixed) {
        for (const beacon of fixedRotation.beacons) {
            beacons.add(beacon.join(','));
        }
    }

    part1 = beacons.size;

    return [part1, part2];
}

function getMatchingRotation(test, fixed) {
    // console.log('get matching rotation');
    for (const testRotation of test) {
        for (const fixedRotation of fixed) {
            for (let i = 0; i < fixedRotation.beacons.length - 11; i++) {
                const fixedPoint = fixedRotation.beacons[i];

                for (const testPoint of testRotation.beacons) {
                    const diff = fixedPoint.map((v, i) => v - testPoint[i]);

                    let matchingCount = 0;
                    const transformedBeacons = [];

                    for (let i = 0; i < testRotation.beacons.length; i++) {
                        const transformed = add(testRotation.beacons[i], diff);
                        if (fixedRotation.set.has(transformed.join(','))) {
                            matchingCount++;
                        } else {
                            if (matchingCount + (testRotation.beacons.length - i - 1) < 12) {
                                break;
                            }
                        }
                        transformedBeacons.push(transformed);
                    }

                    if (matchingCount >= 12) {
                        testRotation.beacons = transformedBeacons;
                        testRotation.set = new Set(transformedBeacons.map((x) => x.join(',')));
                        // testRotation.min = add(testRotation.min, diff);

                        return testRotation;
                    }
                }
            }
        }
    }
}

function add(a, b) {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

const sin = [0, 1, 0, -1];
const cos = [1, 0, -1, 0];

function generateRotationMatrices() {
    const matrices = [];
    for (let rz = 0; rz <= 3; rz++) {
        for (let rx = 0; rx <= 3; rx++) {
            matrices.push(getRotateMatrix(rx, 0, rz));
        }
    }

    for (let ry = 1; ry <= 3; ry += 2) {
        for (let rx = 0; rx <= 3; rx++) {
            matrices.push(getRotateMatrix(rx, ry, 0));
        }
    }
    return matrices;
}

function getRotateMatrix(a, b, c) {
    const matrix = [
        cos[a] * cos[b],
        cos[a] * sin[b] * sin[c] - sin[a] * cos[c],
        cos[a] * sin[b] * cos[c] + sin[a] * sin[c],
        sin[a] * cos[b],
        sin[a] * sin[b] * sin[c] + cos[a] * cos[c],
        sin[a] * sin[b] * cos[c] - cos[a] * sin[c],
        -sin[b],
        cos[b] * sin[c],
        cos[b] * cos[c]
    ];
    return matrix;
}

function rotate(v, m) {
    const v1 = [v[0] * m[0] + v[1] * m[1] + v[2] * m[2], v[0] * m[3] + v[1] * m[4] + v[2] * m[5], v[0] * m[6] + v[1] * m[7] + v[2] * m[8]];
    return v1;
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
