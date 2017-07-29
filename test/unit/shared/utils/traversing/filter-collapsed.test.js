import {expect} from 'chai';
import filterCollapsed from 'src/shared/utils/traversing/filter-collapsed';

describe('filter-collapsed', () => {

    it('should remove collapsed child projects and build types',
        () => {
            // setup
            const tree = {
                id: '_Root',
                vis: {
                    collapsed: false
                },
                childProjects: [{
                    id: 'proj-1',
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
                        parentProjectId: 'proj-1',
                        vis: {
                            collapsed: true
                        },
                        childProjects: []
                    }]
                }, {
                    id: 'proj-2',
                    parentProjectId: '_Root',
                    vis: {
                        collapsed: false
                    },
                    childProjects: [{
                        id: 'proj-2-a',
                        parentProjectId: 'proj-2',
                        vis: {
                            collapsed: true
                        },
                        childProjects: [{
                            id: 'proj-2-a-b',
                            parentProjectId: 'proj-2-a',
                            vis: {
                                collapsed: false
                            },
                            childProjects: []
                        }]
                    }]
                }, {
                    id: 'proj-3',
                    parentProjectId: '_Root',
                    vis: {
                        collapsed: false
                    },
                    childProjects: []
                }]
            };

            // target
            const rootProject = filterCollapsed(tree);

            // expect
            expect(rootProject).to.deep.equal({
                id: '_Root',
                vis: {
                    collapsed: false
                },
                childProjects: [{
                    id: 'proj-1',
                    parentProjectId: '_Root',
                    vis: {
                        collapsed: true
                    },
                    buildTypes: null,
                    childProjects: null
                }, {
                    id: 'proj-2',
                    parentProjectId: '_Root',
                    vis: {
                        collapsed: false
                    },
                    childProjects: [{
                        id: 'proj-2-a',
                        parentProjectId: 'proj-2',
                        vis: {
                            collapsed: true
                        },
                        buildTypes: null,
                        childProjects: null
                    }]
                }, {
                    id: 'proj-3',
                    parentProjectId: '_Root',
                    vis: {
                        collapsed: false
                    },
                    childProjects: []
                }]
            });

        });

    it('should not change original tree', () => {

        // setup
        const tree = {
            id: '_Root',
            vis: {
                collapsed: true
            },
            childProjects: [{
                id: 'proj-1',
                parentProjectId: '_Root',
                vis: {
                    collapsed: true
                },
                childProjects: []
            }]
        };

        // target
        const rootProject = filterCollapsed(tree);

        // expect
        expect(rootProject.childProjects).to.equal(null);
        expect(tree.childProjects).to.not.equal(null);
    });

});