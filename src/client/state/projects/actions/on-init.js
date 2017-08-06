import types from './types';
import api from '../../api';
import supportsDragAndDrop from 'client/utils/check-support-dnd';

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

    if (!supportsDragAndDrop()) {
        dispatch({type: types.DISABLE_DND});
    }
};