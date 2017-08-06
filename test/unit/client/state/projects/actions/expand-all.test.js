import {expect} from 'chai';

import createStore from 'test/utils/create-store';
import * as mockFetch from 'test/utils/mock-fetch';
import findProject from 'src/shared/utils/traversing/find-project';

import expandAll from 'client/state/projects/actions/expand-all';

let fetchMock;

describe('expandAll', () => {

    beforeEach(() => fetchMock = mockFetch.mock());

    it('should expand only visible projects if not configuration mode',
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
                            collapsed: true,
                            visible: true
                        }
                    }, {
                        id: 'proj-2',
                        childProjects: [],
                        buildTypes: [],
                        vis: {
                            collapsed: true,
                            visible: false
                        }
                    }],
                    buildTypes: [],
                    vis: {
                        collapsed: true,
                        visible: true
                    }
                },
                isConfiguringVisibility: false
            });

            // target
            await store.dispatch(expandAll());

            // check
            const state = store.getState();
            const rootProject = state.rootProject;

            expect(rootProject.vis.collapsed).to.equal(false);

            let project = findProject(rootProject, 'proj-1');
            expect(project.vis.collapsed).to.equal(false);

            project = findProject(rootProject, 'proj-2');
            expect(project.vis.collapsed).to.equal(true);

            const visibleRootProject = state.visibleRootProject;
            expect(visibleRootProject.vis.collapsed).to.equal(false);
            expect(visibleRootProject.childProjects).to.have.length(1);
        });

    it('should expand all projects if configuration mode',
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
                            collapsed: true,
                            visible: true
                        }
                    }, {
                        id: 'proj-2',
                        childProjects: [],
                        buildTypes: [],
                        vis: {
                            collapsed: true,
                            visible: false
                        }
                    }],
                    buildTypes: [],
                    vis: {
                        collapsed: true,
                        visible: true
                    }
                },
                isConfiguringVisibility: true
            });

            // target
            await store.dispatch(expandAll());

            // check
            const state = store.getState();
            const rootProject = state.rootProject;
            
            expect(rootProject.vis.collapsed).to.equal(false);

            let project = findProject(rootProject, 'proj-1');
            expect(project.vis.collapsed).to.equal(false);

            project = findProject(rootProject, 'proj-2');
            expect(project.vis.collapsed).to.equal(false);

            const visibleRootProject = state.visibleRootProject;
            expect(visibleRootProject.vis.collapsed).to.equal(false);
            expect(visibleRootProject.childProjects).to.have.length(2);
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
                        collapsed: true,
                        visible: true
                    }
                }, {
                    id: 'proj-2',
                    childProjects: [],
                    buildTypes: [],
                    vis: {
                        collapsed: true,
                        visible: true
                    }
                }],
                buildTypes: [],
                vis: {
                    collapsed: true,
                    visible: true
                }
            },
            isConfiguringVisibility: true
        });

        // target
        await store.dispatch(expandAll());

        // check
        expect(fetchMock.callCount).to.equal(3);

        let params = fetchMock.getCall(0).args;
        expect(params[0]).to.match(
            /api\/projects\/_Root\/vis\/collapsed\?session=.+/);
        expect(params[1].method).to.equal('DELETE');

        params = fetchMock.getCall(1).args;
        expect(params[0]).to.match(
            /api\/projects\/proj-1\/vis\/collapsed\?session=.+/);
        expect(params[1].method).to.equal('DELETE');

        params = fetchMock.getCall(2).args;
        expect(params[0]).to.match(
            /api\/projects\/proj-2\/vis\/collapsed\?session=.+/);
        expect(params[1].method).to.equal('DELETE');
    });

});