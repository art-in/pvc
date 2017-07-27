import {expect} from 'chai';
import findProject from 'src/shared/utils/traversing/find-project';

describe('find-project', () => {

    it('should find project', () => {

        const tree = {
            id: '_Root',
            childProjects: [{
                id: 'proj-1',
                childProjects: [{
                    id: 'proj-1-a',
                    childProjects: []
                }]
            }, {
                id: 'proj-2',
                childProjects: [{
                    id: 'proj-2-a',
                    childProjects: []
                }]
            }]
        };

        const proj = findProject(tree, 'proj-2-a');

        expect(proj).to.exist;
        expect(proj.id).to.equal('proj-2-a');
    });

    it('should throw if project was not found', () => {

        const tree = {
            id: 'proj-1',
            childProjects: []
        };

        const target = () => findProject(tree, 'unknown');

        expect(target).to.throw(`Project 'unknown' was not found`);
    });

});