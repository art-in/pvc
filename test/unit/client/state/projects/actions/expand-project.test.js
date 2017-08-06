import {expect} from 'chai';

import createStore from 'test/utils/create-store';
import * as mockFetch from 'test/utils/mock-fetch';
import findProject from 'src/shared/utils/traversing/find-project';

import expandProject from 'client/state/projects/actions/expand-project';

let fetchMock;

describe('expandProject', () => {

    beforeEach(() => fetchMock = mockFetch.mock());

    it('should expand project', async () => {

        // setup
        const store = createStore({
            rootProject: {
                id: '_Root',
                childProjects: [{
                    id: 'proj-1',
                    childProjects: [],
                    buildTypes: [],
                    vis: {
                        collapsed: false,
                        visible: true
                    }
                }],
                buildTypes: [],
                vis: {
                    collapsed: false,
                    visible: true
                }
            }
        });

        // target
        await store.dispatch(expandProject('_Root'));

        // check
        const state = store.getState();
        const rootProject = state.visibleRootProject;

        let project = findProject(rootProject, '_Root');
        expect(project.vis.collapsed).to.equal(false);

        project = findProject(rootProject, 'proj-1');
        expect(project.vis.collapsed).to.equal(false);
    });

    it('should call rest api', async () => {
        // setup
        const store = createStore({
            rootProject: {
                id: '_Root',
                childProjects: [{
                    id: 'proj-1',
                    childProjects: [],
                    buildTypes: [],
                    vis: {
                        collapsed: false,
                        visible: true
                    }
                }],
                buildTypes: [],
                vis: {
                    collapsed: false,
                    visible: true
                }
            }
        });

        // target
        await store.dispatch(expandProject('proj-1'));

        // check
        expect(fetchMock.calledOnce).to.equal(true);
        const params = fetchMock.firstCall.args;
        expect(params[0]).to.match(
            /api\/projects\/proj-1\/vis\/collapsed\?session=.+/);
        expect(params[1].method).to.equal('DELETE');
    });

    it('should call rest api for not loaded child projects', async () => {

        // setup
        const store = createStore({
            rootProject: {
                id: '_Root',
                vis: {
                    collapsed: false,
                    visible: true
                },
                childrenLoading: false,
                childProjects: null,
                buildTypes: null
            }
        });

        fetchMock = mockFetch.mock({json: () => ({
            buildTypes: [],
            childProjects: []
        })});

        // target
        await store.dispatch(expandProject('_Root'));

        // check
        expect(fetchMock.callCount).to.equal(2);
        const params = fetchMock.secondCall.args;
        expect(params[0]).to.match(
            /\/projects\/_Root\/children\?session=.+/);
        expect(params[1].method).to.equal('GET');
    });

});