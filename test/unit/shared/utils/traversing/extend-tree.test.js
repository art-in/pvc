import {expect} from 'chai';

import extendTree from 'src/shared/utils/traversing/extend-tree';

describe('extend-tree', () => {

    it('should add missing branches from source to target tree', () => {

        // setup
        const targetTree = {
            id: '_Root',
            name: '<Root>',
            buildTypes: [],
            childProjects: [{
                id: 'proj-1',
                name: 'proj-1',
                parentProjectId: '_Root',
                buildTypes: null,
                childProjects: null
            }, {
                id: 'proj-2',
                name: 'proj-2',
                buildTypes: [],
                childProjects: []
            }]
        };

        const sourceTree = {
            id: '_Root',
            name: '<Root>',
            buildTypes: [],
            childProjects: [{
                id: 'proj-1',
                name: 'proj-1',
                parentProjectId: '_Root',
                buildTypes: [{
                    id: 'build-1',
                    name: 'build-1'
                }],
                childProjects: [{
                    id: 'proj-1-a',
                    name: 'proj-1-a',
                    parentProjectId: 'proj-1',
                    buildTypes: null,
                    childProjects: null
                }]
            }, {
                id: 'proj-2',
                name: 'proj-2',
                buildTypes: null,
                childProjects: null
            }]
        };

        // target
        const target = extendTree(targetTree, sourceTree);

        // check
        expect(target).to.exist;
        expect(target).to.deep.equal({
            id: '_Root',
            name: '<Root>',
            buildTypes: [],
            childProjects: [{
                id: 'proj-1',
                name: 'proj-1',
                parentProjectId: '_Root',
                buildTypes: [{
                    id: 'build-1',
                    name: 'build-1'
                }],
                childProjects: [{
                    id: 'proj-1-a',
                    name: 'proj-1-a',
                    parentProjectId: 'proj-1',
                    buildTypes: null,
                    childProjects: null
                }]
            }, {
                id: 'proj-2',
                name: 'proj-2',
                buildTypes: [],
                childProjects: []
            }]
        });
    });

    it('should not change original tree', () => {

        // setup
        const targetTree = {
            id: '_Root',
            name: '<Root>',
            buildTypes: null,
            childProjects: null
        };

        const sourceTree = {
            id: '_Root',
            name: '<Root>',
            buildTypes: [],
            childProjects: []
        };

        // target
        const target = extendTree(targetTree, sourceTree);

        // check
        expect(target).to.exist;
        expect(target.childProjects).to.not.equal(null);
        expect(targetTree.childProjects).to.equal(null);
    });

    it('should throw if source tree has unknown project', () => {
        
        // setup
        const targetTree = {
            id: '_Root',
            name: '<Root>',
            buildTypes: [],
            childProjects: [{
                id: 'proj-1',
                name: 'proj-1',
                parentProjectId: '_Root',
                buildTypes: null,
                childProjects: null
            }]
        };

        const sourceTree = {
            id: '_Root',
            name: '<Root>',
            buildTypes: [],
            childProjects: [{
                id: 'unknown',
                name: 'unknown',
                parentProjectId: '_Root',
                buildTypes: [],
                childProjects: []
            }]
        };

        // target
        const target = () => extendTree(targetTree, sourceTree);

        // check
        expect(target).to.throw(`Project 'unknown' was not found`);
    });

});