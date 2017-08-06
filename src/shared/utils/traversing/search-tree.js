import forEachProject from './for-each-project';
import bubble from './bubble';

/**
 * Returns IDs of entities (projects, build types)
 * which have sub-string found in their names
 * @param {object} rootProject
 * @param {string} searchStr
 * @return {{projectIds, buildTypeIds}} project/build type IDs
 */
export default function searchTree(rootProject, searchStr) {
    const projectIds = new Set();
    const buildTypeIds = new Set();

    searchStr = searchStr.toLowerCase();

    // find projects
    forEachProject(rootProject, p => {
        const inName = p.name.toLowerCase().includes(searchStr);
        let inBuildTypeName = false;

        if (p.buildTypes) {
            const buildTypes = p.buildTypes
                .filter(b => b.name.toLowerCase().includes(searchStr));

            inBuildTypeName = buildTypes.length > 0;
            buildTypes.forEach(b => buildTypeIds.add(b.id));
        }
        
        if (inName || inBuildTypeName) {
            // add found project and entire chain up to root
            bubble(rootProject, p.id, p => projectIds.add(p.id));
        }
    });

    return {
        projectIds: Array.from(projectIds),
        buildTypeIds: Array.from(buildTypeIds)
    };
}