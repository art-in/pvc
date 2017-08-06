import clone from '../clone';
import forEachProject from './for-each-project';
import removeFromArray from '../remove-from-array';

/**
 * Removes build types which are not in the list 
 * of allowed build types
 * @param {object} rootProject 
 * @param {array} buildTypeIds - IDs of allowed build types
 * @return {object} tree
 */
export default function filterBuildTypes(rootProject, buildTypeIds) {
    const result = clone(rootProject);

    forEachProject(result, p => {
        if (p.buildTypes) {
            const buildTypesToRemove = [];
            p.buildTypes.forEach(b => {
                if (!buildTypeIds.includes(b.id)) {
                    buildTypesToRemove.push(b);
                }
            });

            buildTypesToRemove.forEach(
                b => removeFromArray(p.buildTypes, b));
        }
    });

    return result;
}