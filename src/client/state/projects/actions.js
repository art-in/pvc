import api from '../api';

import forEachProject from 'shared/utils/traversing/for-each-project';
import findProject from 'shared/utils/traversing/find-project';
import timer from 'shared/utils/timer';

export const types = {
    PROJECTS_LOADED: 'projects loaded',
    START_VISIBILITY_CONFIGURATION: 'start visibility configuration',
    STOP_VISIBILITY_CONFIGURATION: 'stop visibility configuration',

    COLLAPSE_PROJECT: 'collapse project',
    EXPAND_PROJECT: 'expand project',
    SHOW_PROJECT: 'show project',
    HIDE_PROJECT: 'hide project',
    MOVE_PROJECT: 'move project',

    PROJECT_CHILDREN_LOADING: 'project children loading',
    PROJECT_CHILDREN_LOADED: 'project children loaded'
};

/**
 * Handles on app init event
 * @return {function}
 */
export const onInit = () => async dispatch => {

    // TODO: handle rest api errors
    const rootProject = await api('GET', '/projects');
    
    dispatch({
        type: types.PROJECTS_LOADED,
        rootProject
    });
};

/**
 * Loads children (child projects, build types) to project
 * @param {string} parentProjectId 
 * @return {function}
 */
export const loadChildren = parentProjectId => async dispatch => {

    dispatch({
        type: types.PROJECT_CHILDREN_LOADING,
        parentProjectId
    });

    const {childProjects, buildTypes} =
        await api('GET', `/projects/${parentProjectId}/children`);

    dispatch({
        type: types.PROJECT_CHILDREN_LOADED,
        parentProjectId,
        childProjects,
        buildTypes
    });
};

/**
 * Collapses project
 * @param {string} projectId 
 * @return {function}
 */
export const collapseProject = projectId => dispatch => {

    api('PUT', `/projects/${projectId}/vis/collapsed`);
    
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
export const expandProject = projectId => async (dispatch, getState) => {
    const state = getState();
    const project = findProject(state.rootProject, projectId);

    api('DELETE', `/projects/${projectId}/vis/collapsed`);

    dispatch({
        type: types.EXPAND_PROJECT,
        projectId
    });

    if (project.childProjects === null) {
        // child projects not loaded yet
        await dispatch(loadChildren(projectId));
    }
};

/**
 * Collapses all visible projects
 * @return {function}
 */
export const collapseAll = () => (dispatch, getState) => {
    const state = getState();
    const tasks = [];
    forEachProject(state.rootProject, p =>
        (state.isConfiguringVisibility || p.vis.visible) &&
        !p.vis.collapsed &&
        tasks.push(timer(() => dispatch(collapseProject(p.id)))));
    return Promise.all(tasks);
};

/**
 * Expands all visible projects
 * @return {function}
 */
export const expandAll = () => (dispatch, getState) => {
    const state = getState();
    const tasks = [];
    forEachProject(state.rootProject, p =>
        (state.isConfiguringVisibility || p.vis.visible) &&
        p.vis.collapsed &&
        tasks.push(timer(() => dispatch(expandProject(p.id)))));
    return Promise.all(tasks);
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
export const showProject = projectId => async dispatch => {

    api('PUT', `/projects/${projectId}/vis/visible`);

    dispatch({
        type: types.SHOW_PROJECT,
        projectId
    });
};

/**
 * Hides project (in non-visibility configuration mode)
 * @param {string} projectId 
 * @return {function}
 */
export const hideProject = projectId => async dispatch => {

    api('DELETE', `/projects/${projectId}/vis/visible`);

    dispatch({
        type: types.HIDE_PROJECT,
        projectId
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

    dispatch(moveProject(parent.id, oldIdx, newIdx));
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

    dispatch(moveProject(parent.id, oldIdx, newIdx));
};

/**
 * Moves child project to new position
 * @param {string} parentProjectId 
 * @param {number} oldIdx
 * @param {number} newIdx
 * @return {function}
 */
export const moveProject = (parentProjectId, oldIdx, newIdx) => dispatch => {

    api('PATCH', `/projects/${parentProjectId}/child-projects/positions`, {
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