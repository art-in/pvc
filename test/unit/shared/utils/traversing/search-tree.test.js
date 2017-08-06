import {expect} from 'chai';
import searchTree from 'src/shared/utils/traversing/search-tree';

describe('search-tree', () => {

    it('should return IDs of entities with substring in names', () => {

        // setup
        const tree = {
            id: '_Root',
            name: '<Root>',
            vis: {
                collapsed: false
            },
            buildTypes: [],
            childProjects: [{
                id: 'proj-1',
                name: 'proj-1',
                parentProjectId: '_Root',
                vis: {
                    collapsed: true
                },
                buildTypes: [{
                    id: 'build-1',
                    name: 'build-1'
                }],
                childProjects: [{
                    id: 'proj-1-a',
                    name: 'proj-1-a #FINDME#',
                    parentProjectId: 'proj-1',
                    vis: {
                        collapsed: true
                    },
                    buildTypes: [],
                    childProjects: []
                }]
            }, {
                id: 'proj-2',
                name: 'proj-2',
                parentProjectId: '_Root',
                vis: {
                    collapsed: false
                },
                buildTypes: [],
                childProjects: [{
                    id: 'proj-2-a',
                    name: 'proj-2-a',
                    parentProjectId: 'proj-2',
                    vis: {
                        collapsed: true
                    },
                    buildTypes: [{
                        id: 'build-2-a',
                        name: 'build-2-a'
                    }, {
                        id: 'build-2-b',
                        name: 'build-2-b #FINDME#'
                    }],
                    childProjects: [{
                        id: 'proj-2-a-b',
                        name: 'proj-2-a-b',
                        parentProjectId: 'proj-2-a',
                        vis: {
                            collapsed: false
                        },
                        buildTypes: [],
                        childProjects: []
                    }]
                }]
            }, {
                id: 'proj-3',
                name: 'proj-3',
                parentProjectId: '_Root',
                vis: {
                    collapsed: false
                },
                buildTypes: [],
                childProjects: []
            }]
        };

        // target
        const {projectIds, buildTypeIds} = searchTree(tree, '#FINDME#');

        // check
        expect(projectIds).to.exist;
        expect(projectIds).to.include(
            '_Root',
            'proj-1',
            'proj-1-a',
            'proj-2',
            'proj-2-a'
        );
        expect(buildTypeIds).to.include(
            'build-2-b'
        );
    });

    it('should be case insensitive', () => {

        // setup
        const tree = {
            id: '_Root',
            name: '<Root>',
            vis: {
                collapsed: false
            },
            buildTypes: [],
            childProjects: [{
                id: 'proj-1',
                name: 'proj-1',
                parentProjectId: '_Root',
                vis: {
                    collapsed: true
                },
                buildTypes: [{
                    id: 'build-1',
                    name: 'build-1'
                }],
                childProjects: [{
                    id: 'proj-1-a',
                    name: 'proj-1-a #FiNdMe#',
                    parentProjectId: 'proj-1',
                    vis: {
                        collapsed: true
                    },
                    buildTypes: [],
                    childProjects: []
                }]
            }, {
                id: 'proj-2',
                name: 'proj-2',
                parentProjectId: '_Root',
                vis: {
                    collapsed: false
                },
                buildTypes: [],
                childProjects: [{
                    id: 'proj-2-a',
                    name: 'proj-2-a',
                    parentProjectId: 'proj-2',
                    vis: {
                        collapsed: true
                    },
                    buildTypes: [{
                        id: 'build-2-a',
                        name: 'build-2-a'
                    }, {
                        id: 'build-2-b',
                        name: 'build-2-b #FINDME#'
                    }],
                    childProjects: [{
                        id: 'proj-2-a-b',
                        name: 'proj-2-a-b',
                        parentProjectId: 'proj-2-a',
                        vis: {
                            collapsed: false
                        },
                        buildTypes: [],
                        childProjects: []
                    }]
                }]
            }, {
                id: 'proj-3',
                name: 'proj-3',
                parentProjectId: '_Root',
                vis: {
                    collapsed: false
                },
                buildTypes: [],
                childProjects: []
            }]
        };

        // target
        const {projectIds, buildTypeIds} = searchTree(tree, '#findme#');

        // check
        expect(projectIds).to.include(
            '_Root',
            'proj-1',
            'proj-1-a',
            'proj-2',
            'proj-2-a'
        );
        expect(buildTypeIds).to.include(
            'build-2-b'
        );
    });

});