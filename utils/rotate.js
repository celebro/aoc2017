/**
 *
 * @param {{ x: number, y: number }} vector
 * @param {'left'|'right'} direction
 */
module.exports.rotate = function rotate(vector, direction) {
    const cosTheta = 0;
    const sinTheta = direction === 'left' ? 1 : -1;
    const { x, y } = vector;
    vector.x = x * cosTheta - y * sinTheta;
    vector.y = x * sinTheta + y * cosTheta;

    return vector;
};

/**
 * For inverted y
 * @param {{ x: number, y: number }} vector
 * @param {'left'|'right'} direction
 */
module.exports.rotate2 = function rotate2(vector, direction) {
    const cosTheta = 0;
    const sinTheta = direction === 'right' ? 1 : -1;
    const { x, y } = vector;
    vector.x = x * cosTheta - y * sinTheta;
    vector.y = x * sinTheta + y * cosTheta;

    return vector;
};
