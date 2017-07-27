import {types} from './actions';
import clone from 'shared/utils/clone';
import findProject from 'shared/utils/traversing/find-project';

export default (oldState, action) => {

    const state = clone(oldState);

    switch (action.type) {
    case types.PROJECTS_LOADED:
        state.rootProject = action.rootProject;
        break;

    case types.COLLAPSE_PROJECT: {
        const project = findProject(state.rootProject, action.projectId);
        project.vis.collapsed = true;
        break;
    }

    case types.EXPAND_PROJECT: {
        const project = findProject(state.rootProject, action.projectId);
        project.vis.collapsed = false;
        break;
    }

    case types.START_VISIBILITY_CONFIGURATION:
        state.isConfiguringVisibility = true;
        break;

    case types.STOP_VISIBILITY_CONFIGURATION:
        state.isConfiguringVisibility = false;
        break;

    case types.SHOW_PROJECTS:
        action.projectIds.forEach(id =>
            findProject(state.rootProject, id).vis.visible = true);
        break;

    case types.HIDE_PROJECTS:
        action.projectIds.forEach(id =>
            findProject(state.rootProject, id).vis.visible = false);
        break;

    default:
        return oldState;
    }

    return state;
};