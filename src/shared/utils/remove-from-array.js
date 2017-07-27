/**
 * Removes item from array
 * @param {array} array 
 * @param {*} item 
 */
export default function removeFromArray(array, item) {
    const idx = array.indexOf(item);
    if (idx === -1) {
        throw Error('Cannot delete because item is not in array');
    }
    array.splice(idx, 1);
}