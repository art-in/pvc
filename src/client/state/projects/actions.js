import forEachProject from 'shared/utils/traversing/for-each-project';
import bubble from 'shared/utils/traversing/bubble';
import findProject from 'shared/utils/traversing/find-project';

export const types = {
    PROJECTS_LOADED: 'projects loaded',
    COLLAPSE_PROJECT: 'collapse project',
    EXPAND_PROJECT: 'expand project',
    START_VISIBILITY_CONFIGURATION: 'start visibility configuration',
    STOP_VISIBILITY_CONFIGURATION: 'stop visibility configuration',
    SHOW_PROJECTS: 'show projects',
    HIDE_PROJECTS: 'hide projects',
    MOVE_PROJECT_UP: 'move project up',
    MOVE_PROJECT_DOWN: 'move project down'
};

/**
 * Handles on app init event
 * @return {function}
 */
export const onInit = () => async dispatch => {

    // TODO: handle errors
    const response = await fetch('api/projects');
    const rootProject = await response.json();

    forEachProject(rootProject, p => {
        // setup visibility props
        p.vis = {
            collapsed: false,
            visible: true
        };
    });

    dispatch({
        type: types.PROJECTS_LOADED,
        rootProject
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

/**
 * Starts visibility configuration mode
 * @return {function}
 */
export const startConfiguration = () => async dispatch => {
    dispatch({
        type: types.START_VISIBILITY_CONFIGURATION
    });
};

/**
 * Stops visibility configuration mode
 * @return {function}
 */
export const stopConfiguration = () => async dispatch => {
    dispatch({
        type: types.STOP_VISIBILITY_CONFIGURATION
    });
};

/**
 * Shows project (in non-visibility configuration mode)
 * @param {string} projectId 
 * @return {function}
 */
export const showProject = projectId => async (dispatch, getState) => {
    const state = getState();
    const project = findProject(state.rootProject, projectId);

    const projectToShowIds = [];
    bubble(state.rootProject, projectId,
        p => !p.vis.visible && projectToShowIds.push(p.id));
    forEachProject(project,
        p => !p.vis.visible && projectToShowIds.push(p.id));

    dispatch({
        type: types.SHOW_PROJECTS,
        projectIds: projectToShowIds
    });
};

/**
 * Hides project (in non-visibility configuration mode)
 * @param {string} projectId 
 * @return {function}
 */
export const hideProject = projectId => async (dispatch, getState) => {
    const state = getState();

    const project = findProject(state.rootProject, projectId);
    const projectToHideIds = [];
    forEachProject(project,
        p => p.vis.visible && projectToHideIds.push(p.id));

    dispatch({
        type: types.HIDE_PROJECTS,
        projectIds: projectToHideIds
    });
};

/**
 * Moves project one step up
 * @param {string} projectId
 * @return {function}
 */
export const moveProjectUp = projectId => dispatch => {
    dispatch({
        type: types.MOVE_PROJECT_UP,
        projectId
    });
};

/**
 * Moves project one step down
 * @param {string} projectId
 * @return {function}
 */
export const moveProjectDown = projectId => dispatch => {
    dispatch({
        type: types.MOVE_PROJECT_DOWN,
        projectId
    });
};