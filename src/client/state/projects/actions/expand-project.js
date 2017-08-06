import types from './types';
import api from '../../api';
import uri from 'shared/utils/encode-uri-tag';

import loadChildren from './load-children';
import findProject from 'shared/utils/traversing/find-project';

/**
 * Expands project
 * @param {string} projectId 
 * @return {function}
 */
export default projectId => async (dispatch, getState) => {
    const state = getState();
    const project = findProject(state.rootProject, projectId);

    api('DELETE', uri`/projects/${projectId}/vis/collapsed`);

    dispatch({
        type: types.EXPAND_PROJECT,
        projectId
    });

    if (project.childProjects === null) {
        // child projects not loaded yet
        await dispatch(loadChildren(projectId));
    }
};