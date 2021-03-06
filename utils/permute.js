/**
 * @template T
 * @param {T[]} permutation
 * @yields {T[]}
 */
module.exports.permuteGenerator = function* permute(permutation) {
    var length = permutation.length,
        c = Array(length).fill(0),
        i = 1,
        k,
        p;

    yield permutation.slice();
    while (i < length) {
        if (c[i] < i) {
            k = i % 2 && c[i];
            p = permutation[i];
            // eslint-disable-next-line require-atomic-updates
            permutation[i] = permutation[k];
            // eslint-disable-next-line require-atomic-updates
            permutation[k] = p;
            ++c[i];
            i = 1;
            yield permutation.slice();
        } else {
            c[i] = 0;
            ++i;
        }
    }
};

/**
 * @template T
 * @param {T[]} permutation
 * @returns{T[][]}
 */
module.exports.permute = function permute(permutation) {
    var length = permutation.length,
        result = [permutation.slice()],
        c = new Array(length).fill(0),
        i = 1,
        k,
        p;

    while (i < length) {
        if (c[i] < i) {
            k = i % 2 && c[i];
            p = permutation[i];
            permutation[i] = permutation[k];
            permutation[k] = p;
            ++c[i];
            i = 1;
            result.push(permutation.slice());
        } else {
            c[i] = 0;
            ++i;
        }
    }
    return result;
};
