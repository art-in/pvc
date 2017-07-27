import {expect} from 'chai';
import sinon from 'sinon';

import forEachProject from 'shared/utils/traversing/for-each-project';

describe('for-each-project', () => {

    it('should call fn on each project in tree', () => {

        // setup
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
        const fn = sinon.spy();

        // target
        forEachProject(tree, fn);

        // check
        expect(fn.callCount).to.equal(5);

        expect(fn.getCall(0).args[0].id).to.equal('_Root');
        expect(fn.getCall(1).args[0].id).to.equal('proj-1');
        expect(fn.getCall(2).args[0].id).to.equal('proj-1-a');
        expect(fn.getCall(3).args[0].id).to.equal('proj-2');
        expect(fn.getCall(4).args[0].id).to.equal('proj-2-a');
    });

});