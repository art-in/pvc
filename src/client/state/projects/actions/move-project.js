import types from './types';
import api from '../../api';

import uri from 'shared/utils/encode-uri-tag';
import moveProjectPos from 'shared/utils/traversing/move-project-pos';

/**
 * Moves child project to new position
 * @param {string} parentProjectId 
 * @param {number} visibleOldIdx - old index in visible tree
 * @param {number} visibleNewIdx - new index in visible tree
 * @return {function}
 */
export default (parentProjectId, visibleOldIdx, visibleNewIdx) =>
    (dispatch, getState) => {

        const state = getState();
        const root = state.rootProject;
        const visibleRoot = state.visibleRootProject;

        // convert positions in visible tree to positions in raw tree
        const {oldIdx, newIdx} = moveProjectPos(
            root,
            visibleRoot,
            parentProjectId,
            visibleOldIdx,
            visibleNewIdx);
        
        api('PATCH',
            uri`/projects/${parentProjectId}/child-projects/positions`, {
                oldIdx,
                newIdx
            });

        dispatch({
            type: types.MOVE_PROJECT,
            parentProjectId,
            oldIdx,
            newIdx
        });
    };