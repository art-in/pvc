/**
 * Calls passed function on each project in the tree
 * @param {object} project
 * @param {function} fn
 */
export default function forEachProject(project, fn) {
    fn(project);
    project.childProjects.forEach(p => forEachProject(p, fn));
}