/**
 * Finds project in object tree
 * @param {object} project
 * @param {string} projectId
 * @param {boolean} [isRoot=true] - indicates passed project is root project 
 *                                  (not recursive child)
 * @return {object} found project
 */
export default function findProject(project, projectId, isRoot = true) {

    if (project.id === projectId) {
        return project;
    }

    if (project.childProjects === null) {
        // some projects were not loaded yet
        return;
    }

    for (const p of project.childProjects) {
        const foundProject = findProject(p, projectId, false);
        if (foundProject) {
            return foundProject;
        }
    }

    if (isRoot) {
        throw Error(`Project '${projectId}' was not found`);
    }
}