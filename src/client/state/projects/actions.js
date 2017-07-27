export const types = {
    PROJECTS_LOADED: 'projects loaded',
    COLLAPSE_PROJECT: 'collapse project',
    EXPAND_PROJECT: 'expand project'
};

/**
 * Handles on app init event
 * @return {function}
 */
export const onInit = () => async dispatch => {

    const response = await fetch('api/projects');
    const data = await response.json();

    dispatch({
        type: types.PROJECTS_LOADED,
        data
    });
};

/**
 * Collapses project
 * @param {string} projectId 
 * @return {function}
 */
export const collapseProject = projectId => async dispatch => {
    dispatch({
        type: types.COLLAPSE_PROJECT,
        projectId
    });
};

/**
 * Expands project
 * @param {string} projectId 
 * @return {function}
 */
export const expandProject = projectId => async dispatch => {
    dispatch({
        type: types.EXPAND_PROJECT,
        projectId
    });
};