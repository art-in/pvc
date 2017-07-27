import {types} from './actions';
import clone from 'shared/utils/clone';
import findProject from 'shared/utils/traversing/find-project';

export default (oldState, action) => {

    const state = clone(oldState);

    switch (action.type) {
    case types.PROJECTS_LOADED:
        state.rootProject = action.data;
        break;

    case types.COLLAPSE_PROJECT: {
        const project = findProject(state.rootProject, action.projectId);
        project.collapsed = true;
        break;
    }

    case types.EXPAND_PROJECT: {
        const project = findProject(state.rootProject, action.projectId);
        project.collapsed = false;
        break;
    }

    default:
        return oldState;
    }

    return state;
};