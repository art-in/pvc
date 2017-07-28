import findProject from './find-project';

/**
 * Expands project
 * @param {object} rootProject
 * @param {string} projectId
 */
export default function expandProject(rootProject, projectId) {
    const project = findProject(rootProject, projectId);
    project.vis.collapsed = false;
}