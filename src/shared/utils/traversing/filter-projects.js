import clone from '../clone';
import forEachProject from './for-each-project';
import bubble from './bubble';
import removeFromArray from '../remove-from-array';

/**
 * Removes projects which are not in the list 
 * of allowed projects and not their parents
 * 
 * Note: creates new tree, does not affect original one
 * @param {object} rootProject 
 * @param {array.<string>} projectIds - IDs of allowed projects
 * @param {object} options
 * @param {bool}   options.childOnly - remove children of un-allowed projects,
 *                                     not projects themselves
 * @return {object} tree
 */
export default function filterProjects(
    rootProject,
    projectIds,
    {childOnly = false} = {}) {
    
    const result = clone(rootProject);

    const allowedProjectIds = new Set();

    // add target projects and their parents
    // to the list of allowed projects
    projectIds.forEach(id =>
        bubble(result, id, p => allowedProjectIds.add(p.id)));

    if (!allowedProjectIds.has(result.id)) {
        throw Error(
            `Allowed projects array is either empty or ` +
            `contains projects which does not exist in target tree`);
    }

    forEachProject(result, p => {
        if (p.childProjects) {
            const childToRemove = [];
            p.childProjects.forEach(child => {
                if (!allowedProjectIds.has(child.id)) {
                    if (childOnly) {
                        // remove children from un-allowed project
                        child.childProjects = null;
                        child.buildTypes = null;
                    } else {
                        // remove un-allowed project
                        childToRemove.push(child);
                    }
                }
            });
            childToRemove.forEach(child =>
                removeFromArray(p.childProjects, child));
        }
    });

    return result;
}