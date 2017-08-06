export default {
    
    // root of raw projects tree (before applying visibility rules)
    rootProject: undefined,

    // root of visible projects tree (after applying visibility rules)
    // rendering source. hidden entities are removed
    visibleRootProject: undefined,

    // project list filter
    filter: {
        // IDs of visible entities
        // (null means - no filter applied,
        // empty array - no visible entities)
        projectIds: null,
        buildTypeIds: null
    },

    // indicates whether projects tree is in 
    // visibility configuration mode
    isConfiguringVisibility: false,

    search: {
        // indicates whether search by entity name
        // is running on projects tree
        running: false,

        // search string
        str: null
    },

    // indicates whether projects can be sorted 
    // with drag-drop handles while in visibility 
    // configuration mode, otherwise - up/down buttons
    // old browsers cannot use drag-drop
    useDragAndDrop: true
};