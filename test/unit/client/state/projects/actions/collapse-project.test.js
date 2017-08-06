import {expect} from 'chai';

import createStore from 'test/utils/create-store';
import * as mockFetch from 'test/utils/mock-fetch';
import findProject from 'src/shared/utils/traversing/find-project';

import collapseProject from 'client/state/projects/actions/collapse-project';

let fetchMock;

describe('collapseProject', () => {

    beforeEach(() => fetchMock = mockFetch.mock());

    it('should collapse project', async () => {

        // setup
        const store = createStore({
            rootProject: {
                id: '_Root',
                childProjects: [{
                    id: 'proj-1',
                    childProjects: [],
                    buildTypes: null,
                    vis: {
                        collapsed: false,
                        visible: true
                    }
                }],
                buildTypes: null,
                vis: {
                    collapsed: false,
                    visible: true
                }
            }
        });

        // target
        await store.dispatch(collapseProject('proj-1'));

        // check
        const state = store.getState();
        const rootProject = state.visibleRootProject;

        let project = findProject(rootProject, '_Root');
        expect(project.vis.collapsed).to.equal(false);

        project = findProject(rootProject, 'proj-1');
        expect(project.vis.collapsed).to.equal(true);
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
        await store.dispatch(collapseProject('proj-1'));

        // check
        expect(fetchMock.calledOnce).to.equal(true);
        const params = fetchMock.firstCall.args;
        expect(params[0]).to.match(
            /api\/projects\/proj-1\/vis\/collapsed\?session=.+/);
        expect(params[1].method).to.equal('PUT');
    });

});