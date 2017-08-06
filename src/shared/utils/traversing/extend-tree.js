import clone from '../clone';
import forEachProject from './for-each-project';
import findProject from './find-project';

/**
 * Adds missing branches (child projects, build types)
 * from source to target tree
 *
 * Note: creates new tree, does not affect original one
 * @param {object} targetTree
 * @param {object} sourceTree
 * @return {object} tree
 */
export default function extendTree(targetTree, sourceTree) {
    const result = clone(targetTree);

    forEachProject(sourceTree, sourceProj => {
        if (sourceProj.childProjects !== null &&
            sourceProj.buildTypes !== null) {
            
            const targetProj = findProject(result, sourceProj.id);

            if (targetProj.childProjects === null ||
                targetProj.buildTypes === null) {
                
                targetProj.childProjects = clone(sourceProj.childProjects);
                targetProj.buildTypes = clone(sourceProj.buildTypes);
            }
        }
    });

    return result;
}