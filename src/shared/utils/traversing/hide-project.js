import findProject from './find-project';
import forEachProject from './for-each-project';

/**
 * Hides project
 * @param {object} rootProject 
 * @param {string} projectId 
 */
export default function hideProject(rootProject, projectId) {
    const project = findProject(rootProject, projectId);
    forEachProject(project, p => p.vis.visible = false);
}