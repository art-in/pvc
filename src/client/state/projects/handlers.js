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
    
    case types.MOVE_PROJECT: {
        const parent = findProject(state.rootProject, action.parentProjectId);
        const children = parent.childProjects;
        let {newIdx, oldIdx} = action;
        const project = children[oldIdx];

        // border check
        oldIdx = Math.max(oldIdx, 0);
        oldIdx = Math.min(oldIdx, children.length - 1);
        newIdx = Math.max(newIdx, 0);
        newIdx = Math.min(newIdx, children.length - 1);

        if (oldIdx === newIdx) {
            // position was not changed
            return oldState;
        }
        
        // move
        children.splice(oldIdx, 1);
        children.splice(newIdx, 0, project);
        break;
    }

    default:
        return oldState;
    }

    return state;
};