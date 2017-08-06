import api from '../api';

import uri from 'shared/utils/encode-uri-tag';
import timer from 'shared/utils/timer';
import forEachProject from 'shared/utils/traversing/for-each-project';
import findProject from 'shared/utils/traversing/find-project';
import searchTree from 'shared/utils/traversing/search-tree';
import moveProjectPos from 'shared/utils/traversing/move-project-pos';

export const types = {
    SET_PROJECTS_TREE: 'set projects tree',
    EXTEND_PROJECTS_TREE: 'extend projects tree',

    PROJECT_CHILDREN_LOADING: 'project children loading',
    PROJECT_CHILDREN_LOADED: 'project children loaded',

    START_VISIBILITY_CONFIGURATION: 'start visibility configuration',
    STOP_VISIBILITY_CONFIGURATION: 'stop visibility configuration',

    COLLAPSE_PROJECT: 'collapse project',
    EXPAND_PROJECT: 'expand project',
    SHOW_PROJECT: 'show project',
    HIDE_PROJECT: 'hide project',
    MOVE_PROJECT: 'move project',

    SET_PROJECTS_FILTER: 'set projects filter',

    START_SEARCH: 'start search',
    END_SEARCH: 'end search',
    SET_SEARCH_STRING: 'set search string'
};

/**
 * Handles on app init event
 * @return {function}
 */
export const onInit = () => async dispatch => {

    // TODO: handle rest api errors
    const rootProject = await api('GET', '/projects');
    
    dispatch({
        type: types.SET_PROJECTS_TREE,
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
        await api('GET', uri`/projects/${parentProjectId}/children`);

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

    api('PUT', uri`/projects/${projectId}/vis/collapsed`);
    
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
 * Configures project to be visible in normal mode (not configuration)
 * @param {string} projectId 
 * @return {function}
 */
export const showProject = projectId => async dispatch => {

    api('PUT', uri`/projects/${projectId}/vis/visible`);

    dispatch({
        type: types.SHOW_PROJECT,
        projectId
    });
};

/**
 * Configures project to be hidden in normal mode (not configuration)
 * @param {string} projectId 
 * @return {function}
 */
export const hideProject = projectId => async dispatch => {

    api('DELETE', uri`/projects/${projectId}/vis/visible`);

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
    const visibleRoot = state.visibleRootProject;

    const project = findProject(visibleRoot, projectId);
    const parent = findProject(visibleRoot, project.parentProjectId);

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
    const visibleRoot = state.visibleRootProject;

    const project = findProject(visibleRoot, projectId);
    const parent = findProject(visibleRoot, project.parentProjectId);

    const oldIdx = parent.childProjects.indexOf(project);
    const newIdx = oldIdx + 1;

    dispatch(moveProject(parent.id, oldIdx, newIdx));
};

/**
 * Moves child project to new position
 * @param {string} parentProjectId 
 * @param {number} visibleOldIdx - old index in visible tree
 * @param {number} visibleNewIdx - new index in visible tree
 * @return {function}
 */
export const moveProject = (parentProjectId, visibleOldIdx, visibleNewIdx) =>
    (dispatch, getState) => {

        const state = getState();
        const root = state.rootProject;
        const visibleRoot = state.visibleRootProject;

        // convert positions in visible tree to positions in raw tree
        const {oldIdx, newIdx} = moveProjectPos(
            root,
            visibleRoot,
            parentProjectId,
            visibleOldIdx,
            visibleNewIdx);
        
        api('PATCH',
            uri`/projects/${parentProjectId}/child-projects/positions`, {
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

/**
 * Search tree by sub-string found in
 * project name or build type name
 * @param {string} searchStr 
 * @return {function}
 */
export const search = searchStr => async (dispatch, getState) => {
    const state = getState();
    const {rootProject} = state;

    if (!searchStr) {
        dispatch({type: types.SET_SEARCH_STRING, str: null});
        
        // stop filtering
        dispatch({
            type: types.SET_PROJECTS_FILTER,
            projectIds: null,
            buildTypeIds: null
        });
        return;
    }

    dispatch({type: types.SET_SEARCH_STRING, str: searchStr});
    dispatch({type: types.START_SEARCH});

    // search and filter already loaded entities
    const {projectIds: localProjIds, buildTypeIds: localBuildTypeIds} =
        searchTree(rootProject, searchStr);
    
    dispatch({
        type: types.SET_PROJECTS_FILTER,
        projectIds: localProjIds,
        buildTypeIds: localBuildTypeIds
    });

    // search all entities on server
    const {
        tree: serverTree,
        projectIds: serverProjIds,
        buildTypeIds: serverBuildTypeIds
    } = await api(`GET`, uri`/projects/search?s=${searchStr}`);
    
    if (serverTree) {
        dispatch({
            type: types.EXTEND_PROJECTS_TREE,
            source: serverTree
        });
    }

    // filter by found entities
    dispatch({
        type: types.SET_PROJECTS_FILTER,
        projectIds: serverProjIds,
        buildTypeIds: serverBuildTypeIds
    });

    dispatch({type: types.END_SEARCH});
};