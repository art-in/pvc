import bubble from './bubble';
import forEachProject from './for-each-project';
import findProject from './find-project';

/**
 * Shows project
 * @param {object} rootProject 
 * @param {string} projectId 
 */
export default function showProject(rootProject, projectId) {
    const project = findProject(rootProject, projectId);

    bubble(rootProject, projectId,
        p => p.vis.visible = true);
    forEachProject(project,
        p => p.vis.visible = true);
}