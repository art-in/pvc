/**
 * Clones object
 * @param {object} obj -
 * @return {object} clone
 */
export default function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}