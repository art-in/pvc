import findProject from './find-project';

/**
 * Moves child project to new position
 * @param {object} rootProject 
 * @param {string} parentProjectId 
 * @param {number} oldIdx 
 * @param {number} newIdx 
 */
export default function moveProject(
    rootProject,
    parentProjectId,
    oldIdx,
    newIdx) {

    const parent = findProject(rootProject, parentProjectId);
    const children = parent.childProjects;
    const project = children[oldIdx];

    // border check
    oldIdx = Math.max(oldIdx, 0);
    oldIdx = Math.min(oldIdx, children.length - 1);
    newIdx = Math.max(newIdx, 0);
    newIdx = Math.min(newIdx, children.length - 1);

    if (oldIdx === newIdx) {
        // position was not changed
        return;
    }
    
    // move
    children.splice(oldIdx, 1);
    children.splice(newIdx, 0, project);
}