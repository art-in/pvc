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

    case types.MOVE_PROJECT_UP: {
        const project = findProject(state.rootProject, action.projectId);
        const parent = findProject(state.rootProject, project.parentProjectId);
        const children = parent.childProjects;
        const idx = children.indexOf(project);

        if (idx === 0) {
            // boundary check
            return oldState;
        }

        // swap
        [children[idx - 1], children[idx]] = [children[idx], children[idx - 1]];
        break;
    }

    case types.MOVE_PROJECT_DOWN: {
        const project = findProject(state.rootProject, action.projectId);
        const parent = findProject(state.rootProject, project.parentProjectId);
        const children = parent.childProjects;
        const idx = children.indexOf(project);

        if (idx === children.length - 1) {
            // boundary check
            return oldState;
        }

        // swap
        [children[idx + 1], children[idx]] = [children[idx], children[idx + 1]];
        break;
    }

    default:
        return oldState;
    }

    return state;
};