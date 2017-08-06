import {expect} from 'chai';

import createStore from 'test/utils/create-store';
import * as mockFetch from 'test/utils/mock-fetch';
import findProject from 'src/shared/utils/traversing/find-project';

import showProject from 'client/state/projects/actions/show-project';

let fetchMock;

describe('showProject', () => {

    beforeEach(() => fetchMock = mockFetch.mock());

    it('should show all parents up to root', async () => {

        // setup
        const store = createStore({
            rootProject: {
                id: '_Root',
                vis: {
                    collapsed: false,
                    visible: false
                },
                buildTypes: [],
                childProjects: [{
                    id: 'proj-1',
                    vis: {
                        collapsed: false,
                        visible: false
                    },
                    parentProjectId: '_Root',
                    buildTypes: [],
                    childProjects: [{
                        id: 'proj-1-a',
                        vis: {
                            collapsed: false,
                            visible: false
                        },
                        parentProjectId: 'proj-1',
                        buildTypes: [],
                        childProjects: []
                    }]
                }, {
                    id: 'proj-2',
                    vis: {
                        collapsed: false,
                        visible: false
                    },
                    parentProjectId: '_Root',
                    buildTypes: [],
                    childProjects: []
                }]
            }
        });

        // target
        await store.dispatch(showProject('proj-1-a'));

        // check
        const state = store.getState();
        const root = state.rootProject;

        expect(findProject(root, 'proj-1-a').vis.visible).to.equal(true);
        expect(findProject(root, 'proj-1').vis.visible).to.equal(true);
        expect(findProject(root, '_Root').vis.visible).to.equal(true);
        expect(findProject(root, 'proj-2').vis.visible).to.equal(false);

        const visibleRoot = state.visibleRootProject;
        expect(visibleRoot.childProjects).to.have.length(1);
    });

    it('should show all children deep', async () => {

        // setup
        const store = createStore({
            rootProject: {
                id: '_Root',
                vis: {
                    collapsed: false,
                    visible: false
                },
                buildTypes: [],
                childProjects: [{
                    id: 'proj-1',
                    vis: {
                        collapsed: false,
                        visible: false
                    },
                    parentProjectId: '_Root',
                    buildTypes: [],
                    childProjects: [{
                        id: 'proj-1-a',
                        vis: {
                            collapsed: false,
                            visible: false
                        },
                        parentProjectId: 'proj-1',
                        buildTypes: [],
                        childProjects: []
                    }]
                }, {
                    id: 'proj-2',
                    vis: {
                        collapsed: false,
                        visible: false
                    },
                    parentProjectId: '_Root',
                    buildTypes: [],
                    childProjects: []
                }]
            }
        });

        // target
        await store.dispatch(showProject('proj-1'));

        // check
        const state = store.getState();
        const root = state.rootProject;

        expect(findProject(root, '_Root').vis.visible).to.equal(true);
        expect(findProject(root, 'proj-1').vis.visible).to.equal(true);
        expect(findProject(root, 'proj-1-a').vis.visible).to.equal(true);
        expect(findProject(root, 'proj-2').vis.visible).to.equal(false);

        const visRoot = state.visibleRootProject;
        expect(visRoot.childProjects).to.have.length(1);
        expect(findProject(visRoot, 'proj-1-a').vis.visible).to.equal(true);
    });

    it('should expand all parents up to root when filtering', async () => {

        // setup
        const store = createStore({
            rootProject: {
                id: '_Root',
                vis: {
                    collapsed: true,
                    visible: false
                },
                buildTypes: [],
                childProjects: [{
                    id: 'proj-1',
                    vis: {
                        collapsed: true,
                        visible: false
                    },
                    parentProjectId: '_Root',
                    buildTypes: [],
                    childProjects: [{
                        id: 'proj-1-a',
                        vis: {
                            collapsed: true,
                            visible: false
                        },
                        parentProjectId: 'proj-1',
                        buildTypes: [],
                        childProjects: []
                    }]
                }, {
                    id: 'proj-2',
                    vis: {
                        collapsed: true,
                        visible: false
                    },
                    parentProjectId: '_Root',
                    buildTypes: [],
                    childProjects: []
                }]
            },
            filter: {
                projectIds: ['proj-1-a', 'proj-1', '_Root']
            }
        });

        // target
        await store.dispatch(showProject('proj-1-a'));

        // check
        const state = store.getState();
        const root = state.rootProject;

        expect(findProject(root, 'proj-1-a').vis.collapsed).to.equal(false);
        expect(findProject(root, 'proj-1').vis.collapsed).to.equal(false);
        expect(findProject(root, '_Root').vis.collapsed).to.equal(false);
        expect(findProject(root, 'proj-2').vis.collapsed).to.equal(true);

        const visibleRoot = state.visibleRootProject;
        expect(visibleRoot.childProjects).to.have.length(1);
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
        await store.dispatch(showProject('proj-1'));

        // check
        expect(fetchMock.calledOnce).to.equal(true);
        const params = fetchMock.firstCall.args;
        expect(params[0]).to.match(
            /api\/projects\/proj-1\/vis\/visible\?session=.+/);
        expect(params[1].method).to.equal('PUT');
    });

});