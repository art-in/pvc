import types from './types';
import api from '../../api';

/**
 * Handles on app init event
 * @return {function}
 */
export default () => async dispatch => {

    // TODO: handle rest api errors
    const rootProject = await api('GET', '/projects');
    
    dispatch({
        type: types.SET_PROJECTS_TREE,
        rootProject
    });
};