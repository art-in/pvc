import extend from 'extend';

/**
 * Clones object
 * @param {object} obj -
 * @return {object} clone
 */
export function clone(obj) {
    return extend({}, obj);
}