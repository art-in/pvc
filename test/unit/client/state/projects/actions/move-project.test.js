import {expect} from 'chai';

import createStore from 'test/utils/create-store';
import * as mockFetch from 'test/utils/mock-fetch';

import moveProject from 'client/state/projects/actions/move-project';

let fetchMock;

describe('moveProject', () => {

    beforeEach(() => fetchMock = mockFetch.mock());

    it('should move project to new position', async () => {

        // setup
        const rootProject = {
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
                childProjects: []
            }, {
                id: 'proj-2',
                vis: {
                    collapsed: false,
                    visible: true
                },
                parentProjectId: '_Root',
                buildTypes: [],
                childProjects: []
            }, {
                id: 'proj-3',
                vis: {
                    collapsed: false,
                    visible: true
                },
                parentProjectId: '_Root',
                buildTypes: [],
                childProjects: []
            }]
        };

        const store = createStore({
            rootProject,
            visibleRootProject: rootProject
        });

        // target
        await store.dispatch(moveProject('_Root', 0, 2));

        // check
        const state = store.getState();
        const root = state.visibleRootProject;

        expect(root.childProjects).to.have.length(3);
        expect(root.childProjects[0].id).to.equal('proj-2');
        expect(root.childProjects[1].id).to.equal('proj-3');
        expect(root.childProjects[2].id).to.equal('proj-1');
    });

    it('should not move project outside right border', async () => {

        // setup
        const rootProject = {
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
                childProjects: []
            }, {
                id: 'proj-2',
                vis: {
                    collapsed: false,
                    visible: true
                },
                parentProjectId: '_Root',
                buildTypes: [],
                childProjects: []
            }, {
                id: 'proj-3',
                vis: {
                    collapsed: false,
                    visible: true
                },
                parentProjectId: '_Root',
                buildTypes: [],
                childProjects: []
            }]
        };

        const store = createStore({
            rootProject,
            visibleRootProject: rootProject
        });

        // target
        await store.dispatch(moveProject('_Root', 0, 100));

        // check
        const state = store.getState();
        const root = state.visibleRootProject;

        expect(root.childProjects).to.have.length(3);
        expect(root.childProjects[0].id).to.equal('proj-2');
        expect(root.childProjects[1].id).to.equal('proj-3');
        expect(root.childProjects[2].id).to.equal('proj-1');
    });

    it('should not move project outside left border', async () => {

        // setup
        const rootProject = {
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
                childProjects: []
            }, {
                id: 'proj-2',
                vis: {
                    collapsed: false,
                    visible: true
                },
                parentProjectId: '_Root',
                buildTypes: [],
                childProjects: []
            }, {
                id: 'proj-3',
                vis: {
                    collapsed: false,
                    visible: true
                },
                parentProjectId: '_Root',
                buildTypes: [],
                childProjects: []
            }]
        };

        const store = createStore({
            rootProject,
            visibleRootProject: rootProject
        });

        // target
        await store.dispatch(moveProject('_Root', 2, -100));

        // check
        const state = store.getState();
        const root = state.visibleRootProject;

        expect(root.childProjects).to.have.length(3);
        expect(root.childProjects[0].id).to.equal('proj-3');
        expect(root.childProjects[1].id).to.equal('proj-1');
        expect(root.childProjects[2].id).to.equal('proj-2');
    });

    it('should take hidden projects into account', async () => {

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
                    childProjects: []
                }, {
                    id: 'proj-2',
                    vis: {
                        collapsed: false,
                        visible: false
                    },
                    parentProjectId: '_Root',
                    buildTypes: [],
                    childProjects: []
                }, {
                    id: 'proj-3',
                    vis: {
                        collapsed: false,
                        visible: true
                    },
                    parentProjectId: '_Root',
                    buildTypes: [],
                    childProjects: []
                }]
            },

            visibleRootProject: {
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
                    childProjects: []
                }, {
                    id: 'proj-3',
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
        await store.dispatch(moveProject('_Root', 0, 1));

        // check
        const state = store.getState();
        const root = state.rootProject;
        const visRoot = state.visibleRootProject;

        expect(root.childProjects).to.have.length(3);
        expect(root.childProjects[0].id).to.equal('proj-2');
        expect(root.childProjects[1].id).to.equal('proj-3');
        expect(root.childProjects[2].id).to.equal('proj-1');

        expect(visRoot.childProjects).to.have.length(2);
        expect(visRoot.childProjects[0].id).to.equal('proj-3');
        expect(visRoot.childProjects[1].id).to.equal('proj-1');
    });

    it('should call rest api', async () => {
        
        // setup
        const rootProject = {
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
                childProjects: []
            }, {
                id: 'proj-2',
                vis: {
                    collapsed: false,
                    visible: true
                },
                parentProjectId: '_Root',
                buildTypes: [],
                childProjects: []
            }, {
                id: 'proj-3',
                vis: {
                    collapsed: false,
                    visible: true
                },
                parentProjectId: '_Root',
                buildTypes: [],
                childProjects: []
            }]
        };

        const store = createStore({
            rootProject,
            visibleRootProject: rootProject
        });

        // target
        await store.dispatch(moveProject('_Root', 0, 2));

        // check
        expect(fetchMock.calledOnce).to.equal(true);
        const params = fetchMock.firstCall.args;
        expect(params[0]).to.match(
            /api\/projects\/_Root\/child-projects\/positions\?session=.+/);
        expect(params[1].method).to.equal('PATCH');
        expect(params[1].body).to.equal(JSON.stringify({
            oldIdx: 0,
            newIdx: 2
        }));
    });

});