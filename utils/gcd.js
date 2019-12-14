/**
 * @param {number} _a
 * @param {number} _b
 * @returns {number}
 */
module.exports = function gcd(_a, _b) {
    let a = _a;
    let b = _b;
    if (_a < _b) {
        a = _b;
        b = _a;
    }

    while (b > 0) {
        let tmp = a % b;
        a = b;
        b = tmp;
    }

    return a;
};
