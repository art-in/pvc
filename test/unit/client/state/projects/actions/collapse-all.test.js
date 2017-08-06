import {expect} from 'chai';

import createStore from 'test/utils/create-store';
import * as mockFetch from 'test/utils/mock-fetch';
import findProject from 'src/shared/utils/traversing/find-project';

import collapseAll from 'client/state/projects/actions/collapse-all';

let fetchMock;

describe('collapseAll', () => {

    beforeEach(() => fetchMock = mockFetch.mock());

    it('should collapse only visible projects if not configuration mode',
        async () => {

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
                    }, {
                        id: 'proj-2',
                        childProjects: [],
                        buildTypes: [],
                        vis: {
                            collapsed: false,
                            visible: false
                        }
                    }],
                    buildTypes: [],
                    vis: {
                        collapsed: false,
                        visible: true
                    }
                },
                isConfiguringVisibility: false
            });

            // target
            await store.dispatch(collapseAll());

            // check
            const state = store.getState();
            const rootProject = state.rootProject;
            expect(rootProject.vis.collapsed).to.equal(true);

            let project = findProject(rootProject, 'proj-1');
            expect(project.vis.collapsed).to.equal(true);

            project = findProject(rootProject, 'proj-2');
            expect(project.vis.collapsed).to.equal(false);

            const visibleRootProject = state.visibleRootProject;
            expect(visibleRootProject.vis.collapsed).to.equal(true);
            expect(visibleRootProject.childProjects).to.equal(null);
        });

    it('should collapse all projects if configuration mode',
        async () => {

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
                    }, {
                        id: 'proj-2',
                        childProjects: [],
                        buildTypes: [],
                        vis: {
                            collapsed: false,
                            visible: false
                        }
                    }],
                    buildTypes: [],
                    vis: {
                        collapsed: false,
                        visible: true
                    }
                },
                isConfiguringVisibility: true
            });

            // target
            await store.dispatch(collapseAll());

            // check
            const state = store.getState();
            const rootProject = state.rootProject;
            expect(rootProject.vis.collapsed).to.equal(true);

            let project = findProject(rootProject, 'proj-1');
            expect(project.vis.collapsed).to.equal(true);

            project = findProject(rootProject, 'proj-2');
            expect(project.vis.collapsed).to.equal(true);

            const visibleRootProject = state.visibleRootProject;
            expect(visibleRootProject.vis.collapsed).to.equal(true);
            expect(visibleRootProject.childProjects).to.equal(null);
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
                }, {
                    id: 'proj-2',
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
            },
            isConfiguringVisibility: true
        });

        // target
        await store.dispatch(collapseAll());

        // check
        expect(fetchMock.callCount).to.equal(3);

        let params = fetchMock.getCall(0).args;
        expect(params[0]).to.match(
            /api\/projects\/_Root\/vis\/collapsed\?session=.+/);
        expect(params[1].method).to.equal('PUT');

        params = fetchMock.getCall(1).args;
        expect(params[0]).to.match(
            /api\/projects\/proj-1\/vis\/collapsed\?session=.+/);
        expect(params[1].method).to.equal('PUT');

        params = fetchMock.getCall(2).args;
        expect(params[0]).to.match(
            /api\/projects\/proj-2\/vis\/collapsed\?session=.+/);
        expect(params[1].method).to.equal('PUT');
    });
});