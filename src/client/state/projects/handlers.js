import {types} from './actions';
import clone from 'shared/utils/clone';

import collapseProject from 'shared/utils/traversing/collapse-project';
import expandProject from 'shared/utils/traversing/expand-project';
import showProject from 'shared/utils/traversing/show-project';
import hideProject from 'shared/utils/traversing/hide-project';
import moveProject from 'shared/utils/traversing/move-project';

export default (oldState, action) => {

    const state = clone(oldState);

    switch (action.type) {
    case types.PROJECTS_LOADED:
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

    default:
        return oldState;
    }

    return state;
};