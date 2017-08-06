import {expect} from 'chai';

import filterBuildTypes from 'src/shared/utils/traversing/filter-build-types';

describe('filter-build-types', () => {

    it('should remove un-allowed build types from tree', () => {

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
        const target = filterBuildTypes(
            tree,
            ['build-1-a-b', 'build-2']);

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
                        childProjects: [],
                        buildTypes: [{
                            id: 'build-1-a-b',
                            name: 'build-1-a-b'
                        }]
                    }],
                    buildTypes: []
                }],
                buildTypes: []
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
        });
    });

});