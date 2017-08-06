import bowser from 'bowser';

/**
 * Checks if current UA supports drag-drop behavior
 * for sorting projects in visibility configuration mode
 * @return {bool} true if dnd supported, otherwise - false
 */
export default function supportsDragAndDrop() {

    // TODO: better use feature checks instead of UA sniffing

    // dnd implemented with 'react-sortable-hoc',
    // there is no info on browser support in its docs,
    // but by my experiments it does not work in ie9,
    // and works ok in ie11
    if (bowser.msie) {
        return bowser.check({msie: '11'});
    }

    // tested in latest chrome, ff
    return true;
}