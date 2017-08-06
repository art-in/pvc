import types from './types';
import api from '../../api';
import uri from 'shared/utils/encode-uri-tag';

/**
 * Collapses project
 * @param {string} projectId 
 * @return {function}
 */
export default projectId => dispatch => {

    api('PUT', uri`/projects/${projectId}/vis/collapsed`);
    
    dispatch({
        type: types.COLLAPSE_PROJECT,
        projectId
    });
};