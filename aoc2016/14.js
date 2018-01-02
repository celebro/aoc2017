const md5 = require('md5');

function run(input, part) {
    let i = 0;
    const keys = [];

    const map = new Map();
    function getHash(ix) {
        // return md5(input + ix);
        if (map.has(ix)) {
            return map.get(ix);
        } else {
            let hash = md5(input + ix);
            if (part === 2) {
                for (let i = 0; i < 2016; i++) {
                    hash = md5(hash);
                }
            }

            if (getTriple(hash)) {
                map.set(ix, hash);
                return hash;
            } else {
                map.set(ix, undefined)
            }
        }
    }

    function getTriple(hash) {
        let triple;
        for (let i = 2; i < hash.length; i++) {
            const char = hash.charAt(i);
            if (char === hash.charAt(i - 1) && char === hash.charAt(i - 2)) {
                triple = char;
                break;
            }
        }

        return triple;
    }

    while (keys.length < 64) {
        const hash = getHash(i);
        i++;
        if (hash !== undefined) {
            const triple = getTriple(hash);
            if (triple !== undefined) {
                const searching = triple.repeat(5);
                for (let c = 0; c < 1000; c++) {
                    const hash = getHash(i + c);
                    if (hash !== undefined && hash.indexOf(searching) > -1) {
                        keys.push(hash);
                        break;
                    }
                }
            }
        }
    }

    return i - 1;
}

console.time('time');
console.log('test: ', run('abc', 1), ' / ', run('abc', 2));

console.log('test: ', run('ihaygndm', 1), ' / ', run('ihaygndm', 2));
console.timeEnd('time');
