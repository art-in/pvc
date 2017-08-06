import types from './types';
import api from '../../api';

import uri from 'shared/utils/encode-uri-tag';

/**
 * Configures project to be visible in normal mode (not configuration)
 * @param {string} projectId 
 * @return {function}
 */
export default projectId => async dispatch => {

    api('PUT', uri`/projects/${projectId}/vis/visible`);

    dispatch({
        type: types.SHOW_PROJECT,
        projectId
    });
};