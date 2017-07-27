import {expect} from 'chai';
import sinon from 'sinon';

import bubble from 'shared/utils/traversing/bubble';

describe('bubble', () => {

    it('should call fn from starting project up to root', () => {

        // setup
        const tree = {
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
                    childProjects: []
                }]
            }]
        };
        const fn = sinon.spy();

        // target
        bubble(tree, 'proj-1-a', fn);

        // check
        expect(fn.callCount).to.equal(3);

        expect(fn.getCall(0).args[0].id).to.equal('proj-1-a');
        expect(fn.getCall(1).args[0].id).to.equal('proj-1');
        expect(fn.getCall(2).args[0].id).to.equal('_Root');
    });

});