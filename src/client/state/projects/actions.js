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
    MOVE_PROJECT: 'move project'
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
            collapsed: true,
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
export const expandProject = projectId => dispatch => {
    dispatch({
        type: types.EXPAND_PROJECT,
        projectId
    });
};

/**
 * Expands all projects
 * @return {function}
 */
export const expandAll = () => (dispatch, getState) => {
    const state = getState();
    forEachProject(state.rootProject, p => setTimeout(() => {
        dispatch(expandProject(p.id));
    }));
};

/**
 * Collapses all projects
 * @return {function}
 */
export const collapseAll = () => (dispatch, getState) => {
    const state = getState();
    forEachProject(state.rootProject, p => setTimeout(() => {
        dispatch(collapseProject(p.id));
    }));
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
 * Moves project in parent's children list one position up
 * @param {string} projectId
 * @return {function}
 */
export const moveProjectUp = projectId => (dispatch, getState) => {
    const state = getState();

    const project = findProject(state.rootProject, projectId);
    const parent = findProject(state.rootProject, project.parentProjectId);

    const oldIdx = parent.childProjects.indexOf(project);
    const newIdx = oldIdx - 1;

    dispatch({
        type: types.MOVE_PROJECT,
        parentProjectId: parent.id,
        oldIdx,
        newIdx
    });
};

/**
 * Moves project in parent's children list one position down
 * @param {string} projectId
 * @return {function}
 */
export const moveProjectDown = projectId => (dispatch, getState) => {
    const state = getState();

    const project = findProject(state.rootProject, projectId);
    const parent = findProject(state.rootProject, project.parentProjectId);

    const oldIdx = parent.childProjects.indexOf(project);
    const newIdx = oldIdx + 1;

    dispatch({
        type: types.MOVE_PROJECT,
        parentProjectId: parent.id,
        oldIdx,
        newIdx
    });
};

/**
 * Moves child project to new position
 * @param {string} parentProjectId 
 * @param {number} oldIdx
 * @param {number} newIdx
 * @return {function}
 */
export const moveProject = (parentProjectId, oldIdx, newIdx) => dispatch => {
    dispatch({
        type: types.MOVE_PROJECT,
        parentProjectId,
        oldIdx,
        newIdx
    });
};