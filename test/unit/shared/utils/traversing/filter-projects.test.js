import {expect} from 'chai';

import filterProjects from 'src/shared/utils/traversing/filter-projects';

describe('filter-projects', () => {

    describe('child only', () => {

        it('should remove children of un-allowed projects from tree', () => {

            // setup
            const tree = {
                id: '_Root',
                childProjects: [{
                    id: 'proj-1',
                    parentProjectId: '_Root',
                    childProjects: [{
                        id: 'proj-1-a',
                        parentProjectId: 'proj-1',
                        childProjects: [{
                            id: 'proj-1-a-b',
                            parentProjectId: 'proj-1-a',
                            childProjects: [],
                            buildTypes: [{
                                id: 'build-1-a-b',
                                name: 'build-1-a-b'
                            }]
                        }],
                        buildTypes: [{
                            id: 'build-1-a',
                            name: 'build-1-a'
                        }]
                    }],
                    buildTypes: [{
                        id: 'build-1',
                        name: 'build-1'
                    }]
                }, {
                    id: 'proj-2',
                    parentProjectId: '_Root',
                    childProjects: [{
                        id: 'proj-2-a',
                        parentProjectId: 'proj-2',
                        childProjects: [],
                        buildTypes: []
                    }],
                    buildTypes: [{
                        id: 'build-2',
                        name: 'build-2'
                    }]
                }],
                buildTypes: []
            };

            // target
            const target = filterProjects(
                tree,
                ['proj-1-a'],
                {childOnly: true});

            // check
            expect(target).to.exist;
            expect(target).to.deep.equal({
                id: '_Root',
                childProjects: [{
                    id: 'proj-1',
                    parentProjectId: '_Root',
                    childProjects: [{
                        id: 'proj-1-a',
                        parentProjectId: 'proj-1',
                        childProjects: [{
                            id: 'proj-1-a-b',
                            parentProjectId: 'proj-1-a',
                            childProjects: null,
                            buildTypes: null
                        }],
                        buildTypes: [{
                            id: 'build-1-a',
                            name: 'build-1-a'
                        }]
                    }],
                    buildTypes: [{
                        id: 'build-1',
                        name: 'build-1'
                    }]
                }, {
                    id: 'proj-2',
                    parentProjectId: '_Root',
                    childProjects: null,
                    buildTypes: null
                }],
                buildTypes: []
            });
        });

    });

    it('should remove un-allowed projects from tree', () => {

        // setup
        const tree = {
            id: '_Root',
            childProjects: [{
                id: 'proj-1',
                parentProjectId: '_Root',
                childProjects: [{
                    id: 'proj-1-a',
                    parentProjectId: 'proj-1',
                    childProjects: [{
                        id: 'proj-1-a-b',
                        parentProjectId: 'proj-1-a',
                        childProjects: [],
                        buildTypes: [{
                            id: 'build-1-a-b',
                            name: 'build-1-a-b'
                        }]
                    }],
                    buildTypes: [{
                        id: 'build-1-a',
                        name: 'build-1-a'
                    }]
                }],
                buildTypes: [{
                    id: 'build-1',
                    name: 'build-1'
                }]
            }, {
                id: 'proj-2',
                parentProjectId: '_Root',
                childProjects: [{
                    id: 'proj-2-a',
                    parentProjectId: 'proj-2',
                    childProjects: [],
                    buildTypes: []
                }],
                buildTypes: [{
                    id: 'build-2',
                    name: 'build-2'
                }]
            }],
            buildTypes: []
        };

        // target
        const target = filterProjects(tree, ['proj-1-a']);

        // check
        expect(target).to.exist;
        expect(target).to.deep.equal({
            id: '_Root',
            childProjects: [{
                id: 'proj-1',
                parentProjectId: '_Root',
                childProjects: [{
                    id: 'proj-1-a',
                    parentProjectId: 'proj-1',
                    childProjects: [],
                    buildTypes: [{
                        id: 'build-1-a',
                        name: 'build-1-a'
                    }]
                }],
                buildTypes: [{
                    id: 'build-1',
                    name: 'build-1'
                }]
            }],
            buildTypes: []
        });
    });

    it('should throw if allowed projects not found', () => {

        const tree = {
            id: '_Root',
            childProjects: [],
            buildTypes: []
        };

        const target = () => filterProjects(tree, ['unknown-id']);

        expect(target).to.throw(`Project 'unknown-id' was not found`);

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
        const rootProject = filterProjects(tree, ['_Root']);

        // expect
        expect(rootProject.childProjects).to.have.length(0);
        expect(tree.childProjects).to.have.length(1);
    });

});