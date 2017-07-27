import {expect} from 'chai';
import buildTree from 'src/server/service/build-tree';

describe('build-tree', () => {

    it('should build tree from projects list', () => {
        
        // setup
        const list = {projects: {project: [
            {
                id: '_Root'
            }, {
                id: 'proj-1',
                parentProjectId: '_Root'
            }, {
                id: 'proj-2',
                parentProjectId: '_Root'
            }, {
                id: 'proj-1-a',
                parentProjectId: 'proj-1'
            }, {
                id: 'proj-2-a',
                parentProjectId: 'proj-2'
            }, {
                id: 'proj-2-a-b',
                parentProjectId: 'proj-2-a'
            }, {
                id: 'proj-3',
                parentProjectId: '_Root'
            }
        ]}};

        // target
        const proj = buildTree(list);

        // check
        expect(proj).to.exist;
        expect(proj).to.deep.equal({
            id: '_Root',
            childProjects: [{
                id: 'proj-1',
                parentProjectId: '_Root',
                childProjects: [{
                    id: 'proj-1-a',
                    parentProjectId: 'proj-1',
                    childProjects: []
                }]
            }, {
                id: 'proj-2',
                parentProjectId: '_Root',
                childProjects: [{
                    id: 'proj-2-a',
                    parentProjectId: 'proj-2',
                    childProjects: [{
                        id: 'proj-2-a-b',
                        parentProjectId: 'proj-2-a',
                        childProjects: []
                    }]
                }]
            }, {
                id: 'proj-3',
                parentProjectId: '_Root',
                childProjects: []
            }]
        });
    });

    it('should throw if no root project found', () => {
        const list = {projects: {project: []}};
        const target = () => buildTree(list);

        expect(target).to.throw('No root project found');
    });

});