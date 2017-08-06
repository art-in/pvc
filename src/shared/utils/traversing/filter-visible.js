import forEachProject from './for-each-project';
import filterProjects from './filter-projects';
import filterBuildTypes from './filter-build-types';
import filterCollapsed from './filter-collapsed';

/**
 * Removes entities from tree (projects, build types)
 * which are hidden per visibility rules
 *
 * visiblity rules:
 * project can be hidden by
 * - its own visibility config (ignored in visibility configuration mode)
 * - collapsed state of parent project (ignored when filtering)
 * - filter
 * build types can be hidden by
 * - visibility configuration mode
 * - collapsed state of parent project (ignored when filtering)
 * - filter
 * 
 * Note: creates new tree, does not affect original one
 * @param {object} rootProject 
 * @param {object} filter
 * @param {array.<number>} filter.projectIds - IDs of allowed projects
 * @param {array.<number>} filter.buildTypeIds - IDs of allowed build types
 * @param {bool} [isConfig=false] - is in visibility configuration mode
 * @return {object} tree
 */
export default function filterVisible(rootProject, filter, isConfig) {

    let visibleProjectIds = [];
    let visibleBuildTypeIds = [];

    let result = rootProject;
    
    // remove collapsed if not filtering
    if (filter.projectIds === null && filter.buildTypeIds === null) {
        result = filterCollapsed(rootProject);
    }

    // apply visibility config
    forEachProject(result, p => {
        if (p.id === rootProject.id ||
            isConfig ||
            p.vis.visible) {
            
            visibleProjectIds.push(p.id);
            if (!isConfig && p.buildTypes !== null) {
                visibleBuildTypeIds.push(...p.buildTypes.map(b => b.id));
            }
        }
    });

    // apply filter
    if (filter.projectIds !== null) {
        visibleProjectIds = visibleProjectIds.filter(
            pid => filter.projectIds.includes(pid));
    }

    if (filter.buildTypeIds !== null) {
        visibleBuildTypeIds = visibleBuildTypeIds.filter(
            bid => filter.buildTypeIds.includes(bid));
    }

    if (!visibleProjectIds.length) {
        visibleProjectIds.push(rootProject.id);
    }

    // remove hidden entities
    result = filterProjects(result, visibleProjectIds);
    result = filterBuildTypes(result, visibleBuildTypeIds);

    return result;
}