import types from './types';
import api from '../../api';

import uri from 'shared/utils/encode-uri-tag';
import searchTree from 'shared/utils/traversing/search-tree';

/**
 * Search tree by sub-string found in
 * project name or build type name
 * @param {string} searchStr 
 * @return {function}
 */
export default searchStr => async (dispatch, getState) => {
    const state = getState();
    const {rootProject} = state;

    if (!searchStr) {
        dispatch({type: types.SET_SEARCH_STRING, str: null});
        
        // stop filtering
        dispatch({
            type: types.SET_PROJECTS_FILTER,
            projectIds: null,
            buildTypeIds: null
        });
        return;
    }

    dispatch({type: types.SET_SEARCH_STRING, str: searchStr});
    dispatch({type: types.START_SEARCH});

    // search and filter already loaded entities
    const {projectIds: localProjIds, buildTypeIds: localBuildTypeIds} =
        searchTree(rootProject, searchStr);
    
    dispatch({
        type: types.SET_PROJECTS_FILTER,
        projectIds: localProjIds,
        buildTypeIds: localBuildTypeIds
    });

    // search all entities on server
    const {
        tree: serverTree,
        projectIds: serverProjIds,
        buildTypeIds: serverBuildTypeIds
    } = await api(`GET`, uri`/projects/search?s=${searchStr}`);
    
    if (serverTree) {
        dispatch({
            type: types.EXTEND_PROJECTS_TREE,
            source: serverTree
        });
    }

    // filter by found entities
    dispatch({
        type: types.SET_PROJECTS_FILTER,
        projectIds: serverProjIds,
        buildTypeIds: serverBuildTypeIds
    });

    dispatch({type: types.END_SEARCH});
};