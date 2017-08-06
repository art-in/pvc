import {expect} from 'chai';

import createStore from 'test/utils/create-store';
import * as mockFetch from 'test/utils/mock-fetch';

import loadChildren from 'client/state/projects/actions/load-children';

let fetchMock;

describe('loadChildren', () => {

    it('should call rest api for children', async () => {

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
        await store.dispatch(loadChildren('_Root'));

        // check
        expect(fetchMock.callCount).to.equal(1);
        const params = fetchMock.firstCall.args;
        expect(params[0]).to.match(
            /\/projects\/_Root\/children\?session=.+/);
        expect(params[1].method).to.equal('GET');
    });

    it('should set loading flag on parent project', async () => {

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
        await store.dispatch(loadChildren('_Root'));

        // check
        const state = store.getState();
        const rootProject = state.visibleRootProject;
        expect(rootProject.childrenLoading).to.equal.true;
    });

    it('should set loaded children to parent', async () => {

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
                buildTypes: []
            }
        });

        fetchMock = mockFetch.mock({json: () => ({
            buildTypes: [{
                id: 'build-1',
                name: 'build-1'
            }],
            childProjects: [{
                id: 'proj-1',
                vis: {
                    collapsed: false,
                    visible: true
                },
                childrenLoading: false,
                childProjects: [],
                buildTypes: []
            }]
        })});

        // target
        await store.dispatch(loadChildren('_Root'));

        // check
        const state = store.getState();
        const rootProject = state.visibleRootProject;
        expect(rootProject.childrenLoading).to.equal.false;
        expect(rootProject.childProjects).to.deep.equal([{
            id: 'proj-1',
            vis: {
                collapsed: false,
                visible: true
            },
            childrenLoading: false,
            childProjects: [],
            buildTypes: []
        }]);
        expect(rootProject.buildTypes).to.deep.equal([{
            id: 'build-1',
            name: 'build-1'
        }]);
    });

});