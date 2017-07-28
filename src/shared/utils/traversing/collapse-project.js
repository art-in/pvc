import findProject from './find-project';

/**
 * Collapses project
 * @param {object} rootProject 
 * @param {string} projectId 
 */
export default function collapseProject(rootProject, projectId) {
    const project = findProject(rootProject, projectId);
    project.vis.collapsed = true;
}