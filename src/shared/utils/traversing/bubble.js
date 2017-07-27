import findProject from './find-project';

/**
 * Calls passed function on each project starting
 * from passed project, up to root
 * @param {object} rootProject
 * @param {string} startProjectId
 * @param {function} fn
 */
export default function bubble(rootProject, startProjectId, fn) {
    let currentProject = findProject(rootProject, startProjectId);

    while (currentProject) {
        fn(currentProject);

        const parentId = currentProject.parentProjectId;
        if (parentId) {
            currentProject = findProject(rootProject, parentId, fn);
        } else {
            currentProject = null;
        }
    }
}