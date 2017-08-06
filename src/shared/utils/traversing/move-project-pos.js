import findProject from './find-project';

/**
 * Recalculates positions of moving project in visible tree
 * to corresponding positions in raw tree
 *
 * Note: positions usually originated by UI which renders visible tree,
 * this method converts positions to correct positions in raw tree,
 * taking hidden projects into account
 * 
 * @param {*} rootProject 
 * @param {*} visibleRootProject 
 * @param {*} parentProjectId 
 * @param {*} visibleOldIdx - old position in visible tree
 * @param {*} visibleNewIdx - new position in visible tree
 * @return {{oldIdx, newIdx}} - old/new positions in raw tree
 */
export default function moveProjectPos(
    rootProject,
    visibleRootProject,
    parentProjectId,
    visibleOldIdx,
    visibleNewIdx) {
    
    const visibleParent = findProject(visibleRootProject, parentProjectId);
    const visibleChildren = visibleParent.childProjects;

    // border check
    visibleOldIdx = Math.max(visibleOldIdx, 0);
    visibleOldIdx = Math.min(visibleOldIdx, visibleChildren.length - 1);
    visibleNewIdx = Math.max(visibleNewIdx, 0);
    visibleNewIdx = Math.min(visibleNewIdx, visibleChildren.length - 1);

    const projectId = visibleParent.childProjects[visibleOldIdx].id;
    const parent = findProject(rootProject, parentProjectId);
    const children = parent.childProjects;

    const visibleSibling = visibleParent.childProjects[visibleNewIdx];
    const siblingIdx = children.findIndex(p => p.id === visibleSibling.id);

    const oldIdx = children.findIndex(p => p.id === projectId);
    const newIdx = siblingIdx;

    return {oldIdx, newIdx};
}