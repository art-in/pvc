import {expect} from 'chai';

import createStore from 'test/utils/create-store';
import * as mockFetch from 'test/utils/mock-fetch';
import findProject from 'src/shared/utils/traversing/find-project';

import hideProject from 'client/state/projects/actions/hide-project';

let fetchMock;

describe('hideProject', () => {

    beforeEach(() => fetchMock = mockFetch.mock());

    it('should hide all children deep', async () => {

        // setup
        const store = createStore({
            rootProject: {
                id: '_Root',
                vis: {
                    collapsed: false,
                    visible: true
                },
                buildTypes: [],
                childProjects: [{
                    id: 'proj-1',
                    vis: {
                        collapsed: false,
                        visible: true
                    },
                    parentProjectId: '_Root',
                    buildTypes: [],
                    childProjects: [{
                        id: 'proj-1-a',
                        vis: {
                            collapsed: false,
                            visible: true
                        },
                        parentProjectId: 'proj-1',
                        buildTypes: [],
                        childProjects: []
                    }]
                }, {
                    id: 'proj-2',
                    vis: {
                        collapsed: false,
                        visible: true
                    },
                    parentProjectId: '_Root',
                    buildTypes: [],
                    childProjects: []
                }]
            }
        });

        // target
        await store.dispatch(hideProject('proj-1'));

        // check
        const state = store.getState();
        const root = state.rootProject;

        expect(findProject(root, '_Root').vis.visible).to.equal(true);
        expect(findProject(root, 'proj-1').vis.visible).to.equal(false);
        expect(findProject(root, 'proj-1-a').vis.visible).to.equal(false);
        expect(findProject(root, 'proj-2').vis.visible).to.equal(true);

        const visRoot = state.visibleRootProject;
        expect(visRoot.childProjects).to.have.length(1);
        expect(findProject(visRoot, 'proj-2').vis.visible).to.equal(true);
    });

    it('should call rest api', async () => {
        // setup
        const store = createStore({
            rootProject: {
                id: '_Root',
                buildTypes: [],
                childProjects: [{
                    id: 'proj-1',
                    buildTypes: [],
                    childProjects: [],
                    vis: {
                        collapsed: false,
                        visible: false
                    }
                }],
                vis: {
                    collapsed: false,
                    visible: true
                }
            }
        });

        // target
        await store.dispatch(hideProject('proj-1'));

        // check
        expect(fetchMock.calledOnce).to.equal(true);
        const params = fetchMock.firstCall.args;
        expect(params[0]).to.match(
            /api\/projects\/proj-1\/vis\/visible\?session=.+/);
        expect(params[1].method).to.equal('DELETE');
    });
});