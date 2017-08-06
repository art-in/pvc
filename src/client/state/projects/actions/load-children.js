import types from './types';
import api from '../../api';
import uri from 'shared/utils/encode-uri-tag';

/**
 * Loads children (child projects, build types) to project
 * @param {string} parentProjectId 
 * @return {function}
 */
export default parentProjectId => async dispatch => {

    dispatch({
        type: types.PROJECT_CHILDREN_LOADING,
        parentProjectId
    });

    const {childProjects, buildTypes} =
        await api('GET', uri`/projects/${parentProjectId}/children`);

    dispatch({
        type: types.PROJECT_CHILDREN_LOADED,
        parentProjectId,
        childProjects,
        buildTypes
    });
};