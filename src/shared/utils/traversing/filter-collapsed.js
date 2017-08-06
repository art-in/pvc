import clone from '../clone';
import forEachProject from './for-each-project';

/**
 * Removes children (child projects, build types) from collapsed projects
 * Note: creates new tree, does not affect original one
 * @param {object} rootProject
 * @return {object} tree
 */
export default function filterCollapsed(rootProject) {
    const result = clone(rootProject);

    forEachProject(result, p => {
        // children of root project cannot be filtered
        if (p.vis.collapsed && p.id !== rootProject.id) {
            p.childProjects = null;
            p.buildTypes = null;
        }
    });

    return result;
}