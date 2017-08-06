import types from './actions/types';
import clone from 'shared/utils/clone';

import collapseProject from 'shared/utils/traversing/collapse-project';
import expandProject from 'shared/utils/traversing/expand-project';
import showProject from 'shared/utils/traversing/show-project';
import hideProject from 'shared/utils/traversing/hide-project';
import moveProject from 'shared/utils/traversing/move-project';
import findProject from 'shared/utils/traversing/find-project';
import extendTree from 'shared/utils/traversing/extend-tree';
import filterVisible from 'shared/utils/traversing/filter-visible';

export default (oldState, action) => {

    const state = clone(oldState);

    switch (action.type) {
    case types.SET_PROJECTS_TREE:
        state.rootProject = action.rootProject;
        break;

    case types.COLLAPSE_PROJECT:
        collapseProject(state.rootProject, action.projectId);
        break;

    case types.EXPAND_PROJECT:
        expandProject(state.rootProject, action.projectId);
        break;

    case types.START_VISIBILITY_CONFIGURATION:
        state.isConfiguringVisibility = true;
        break;

    case types.STOP_VISIBILITY_CONFIGURATION:
        state.isConfiguringVisibility = false;
        break;

    case types.SHOW_PROJECT:
        showProject(state.rootProject, action.projectId);
        break;

    case types.HIDE_PROJECT:
        hideProject(state.rootProject, action.projectId);
        break;
    
    case types.MOVE_PROJECT: {
        moveProject(
            state.rootProject,
            action.parentProjectId,
            action.oldIdx,
            action.newIdx);
        break;
    }

    case types.PROJECT_CHILDREN_LOADING: {
        const project = findProject(state.rootProject, action.parentProjectId);
        project.childrenLoading = true;
        break;
    }

    case types.PROJECT_CHILDREN_LOADED: {
        const project = findProject(state.rootProject, action.parentProjectId);
        project.childrenLoading = false;
        project.childProjects = action.childProjects;
        project.buildTypes = action.buildTypes;
        break;
    }

    case types.SET_PROJECTS_FILTER:
        state.filter.projectIds = action.projectIds;
        state.filter.buildTypeIds = action.buildTypeIds;
        break;

    case types.EXTEND_PROJECTS_TREE:
        state.rootProject = extendTree(state.rootProject, action.source);
        break;

    case types.START_SEARCH:
        state.search.running = true;
        break;

    case types.END_SEARCH:
        state.search.running = false;
        break;

    case types.SET_SEARCH_STRING:
        state.search.str = action.str;
        break;

    default:
        return oldState;
    }

    state.visibleRootProject = filterVisible(
        state.rootProject,
        state.filter,
        state.isConfiguringVisibility);

    return state;
};