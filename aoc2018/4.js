const fs = require('fs');
const sscanf = require('scan.js').scan;

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch(e) {}
const testInput = `
[1518-11-01 00:00] Guard #10 begins shift
[1518-11-01 00:05] falls asleep
[1518-11-01 00:25] wakes up
[1518-11-01 00:30] falls asleep
[1518-11-01 00:55] wakes up
[1518-11-01 23:58] Guard #99 begins shift
[1518-11-02 00:40] falls asleep
[1518-11-02 00:50] wakes up
[1518-11-03 00:05] Guard #10 begins shift
[1518-11-03 00:24] falls asleep
[1518-11-03 00:29] wakes up
[1518-11-04 00:02] Guard #99 begins shift
[1518-11-04 00:36] falls asleep
[1518-11-04 00:46] wakes up
[1518-11-05 00:03] Guard #99 begins shift
[1518-11-05 00:45] falls asleep
[1518-11-05 00:55] wakes up
`
.trim()
.replace(/, /g, '\n');


function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter(line => line.length);

    let guard;
    let maxGuard;
    const times = {};
    lines.sort().forEach((line, ix) => {
        const [date, hours, minutes, text] = sscanf(line, '[%s %d:%d]  %[^\n]');

        if (text.startsWith('Guard')) {
            let [id] = sscanf(text, 'Guard #%d');
            if (!times[id]) {
                times[id] = {
                    id: id,
                    sum: 0,
                    lastSleep: 0,
                    minutes: Array(60).fill(0)
                }
            }
            guard = times[id];
        } else if (guard !== undefined) {
            if (text === 'falls asleep') {
                guard.lastSleep = minutes;
            } else if (text === 'wakes up') {
                const duration = minutes - guard.lastSleep;
                guard.sum += duration;
                for (let i = guard.lastSleep; i < guard.lastSleep + duration; i++) {
                    guard.minutes[i] = guard.minutes[i] + 1;
                }
                if (!maxGuard || maxGuard.sum < guard.sum) {
                    maxGuard = guard;
                }
            }
        }
    });

    const maxInMinute = Math.max(...maxGuard.minutes);
    part1 = maxGuard.minutes.indexOf(maxInMinute) * maxGuard.id;

    let maxGuard2, maxInMinute2;
    for (guard of Object.values(times)) {
        const max = Math.max(...guard.minutes);
        if (!maxGuard2 || max > maxInMinute2) {
            maxGuard2 = guard;
            maxInMinute2 = max;
        }
    }
    part2 = maxGuard2.minutes.indexOf(maxInMinute2) * maxGuard2.id;

    return [part1, part2];
}

const testResult = run(testInput);
console.log('test: ', testResult.join(' / '));

const result = run(input);
console.log('result: ', result.join(' / '));
