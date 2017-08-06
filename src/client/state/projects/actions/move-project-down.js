import findProject from 'shared/utils/traversing/find-project';

import moveProject from './move-project';

/**
 * Moves project in parent's children list one position down
 * @param {string} projectId
 * @return {function}
 */
export default projectId => (dispatch, getState) => {
    const state = getState();
    const visibleRoot = state.visibleRootProject;

    const project = findProject(visibleRoot, projectId);
    const parent = findProject(visibleRoot, project.parentProjectId);

    const oldIdx = parent.childProjects.indexOf(project);
    const newIdx = oldIdx + 1;

    dispatch(moveProject(parent.id, oldIdx, newIdx));
};