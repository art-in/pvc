import {expect} from 'chai';

import createStore from 'test/utils/create-store';
import * as mockFetch from 'test/utils/mock-fetch';

import search from 'client/state/projects/actions/search';

let fetchMock;

describe('search', () => {

    beforeEach(() => fetchMock = mockFetch.mock());

    it('should filter tree by localy found entities', async () => {

        // setup
        const store = createStore({
            rootProject: {
                id: '_Root',
                name: '<Root>',
                vis: {
                    visible: true,
                    collapsed: false
                },
                buildTypes: [],
                childProjects: [{
                    id: 'proj-1',
                    name: 'proj-1 #FINDME#',
                    vis: {
                        visible: true,
                        collapsed: false
                    },
                    parentProjectId: '_Root',
                    childProjects: null,
                    buildTypes: null
                }]
            },
            filter: {
                projectIds: [],
                buildTypeIds: []
            }
        });

        // mock search call
        fetchMock = mockFetch.mock({json: () => ({
            tree: null, projectIds: [], buildTypeIds: []
        })});

        // target
        // not awaiting to catch filter state before rest api call
        store.dispatch(search('#FINDME#'));

        // check
        const state = store.getState();

        expect(state.filter.projectIds).to.include(
            '_Root',
            'proj-1'
        );
    });

    it('should call rest api to search tree', async () => {

        // setup
        const store = createStore({
            rootProject: {
                id: '_Root',
                name: '<Root>',
                vis: {
                    collapsed: false
                },
                buildTypes: null,
                childProjects: null
            },
            filter: {
                projectIds: []
            }
        });

        // mock search call
        fetchMock = mockFetch.mock({json: () => ({
            tree: null, projectIds: [], buildTypeIds: []
        })});

        // target
        await store.dispatch(search('#FINDME#'));

        // check
        expect(fetchMock.calledOnce).to.equal(true);
        const params = fetchMock.firstCall.args;
        expect(params[0]).to.match(
            /api\/projects\/search\?s=%23FINDME%23&session=.+/);
        expect(params[1].method).to.equal('GET');
    });

    it('should extend tree by search result tree', async () => {
        
        // setup
        const store = createStore({
            rootProject: {
                id: '_Root',
                name: '<Root>',
                vis: {
                    visible: true,
                    collapsed: false
                },
                buildTypes: null,
                childProjects: null
            },
            filter: {
                projectIds: []
            }
        });

        // mock search call
        fetchMock = mockFetch.mock({json: () => ({
            tree: {
                id: '_Root',
                name: '<Root>',
                vis: {
                    visible: true,
                    collapsed: false
                },
                buildTypes: [],
                childProjects: [{
                    id: 'proj-1',
                    name: 'proj-1 #FINDME#',
                    vis: {
                        visible: true,
                        collapsed: false
                    },
                    parentProjectId: '_Root',
                    childProjects: [],
                    buildTypes: []
                }]
            },
            projectIds: ['_Root', 'proj-1'],
            buildTypeIds: []
        })});

        // target
        await store.dispatch(search('#FINDME#'));

        // check
        const state = store.getState();
        const root = state.visibleRootProject;

        expect(root).to.deep.equal({
            id: '_Root',
            name: '<Root>',
            vis: {
                visible: true,
                collapsed: false
            },
            buildTypes: [],
            childProjects: [{
                id: 'proj-1',
                name: 'proj-1 #FINDME#',
                vis: {
                    visible: true,
                    collapsed: false
                },
                parentProjectId: '_Root',
                childProjects: [],
                buildTypes: []
            }]
        });
    });

    it('should filter tree by search result entities', async () => {

        // setup
        const store = createStore({
            rootProject: {
                id: '_Root',
                name: '<Root>',
                vis: {
                    visible: true,
                    collapsed: false
                },
                buildTypes: null,
                childProjects: null
            },
            filter: {
                projectIds: [],
                buildTypeIds: []
            }
        });

        // mock search call
        fetchMock = mockFetch.mock({json: () => ({
            tree: {
                id: '_Root',
                name: '<Root>',
                vis: {
                    collapsed: false
                },
                buildTypes: [],
                childProjects: [{
                    id: 'proj-1',
                    name: 'proj-1 #FINDME#',
                    vis: {
                        visible: true,
                        collapsed: false
                    },
                    parentProjectId: '_Root',
                    childProjects: [],
                    buildTypes: [{
                        id: 'build-1',
                        name: 'build-1 #FINDME#'
                    }]
                }]
            },
            projectIds: ['_Root', 'proj-1'],
            buildTypeIds: ['build-1']
        })});

        // target
        await store.dispatch(search('#FINDME#'));

        // check
        const state = store.getState();

        expect(state.filter.projectIds).to.include(
            '_Root',
            'proj-1'
        );
        expect(state.filter.buildTypeIds).to.include(
            'build-1'
        );
    });

    it('should enable "searching" flag while searching', async () => {
        
        // setup
        const store = createStore({
            rootProject: {
                id: '_Root',
                name: '<Root>',
                vis: {
                    visible: true,
                    collapsed: false
                },
                buildTypes: [],
                childProjects: []
            },
            filter: {
                projectIds: [],
                buildTypeIds: []
            }
        });

        // mock search call
        fetchMock = mockFetch.mock({json: () => ({
            tree: null, projectIds: [], buildTypeIds: []
        })});

        // target
        // not awaiting to catch filter state before rest api call
        store.dispatch(search('#FINDME#'));

        // check
        const state = store.getState();

        expect(state.search.running).to.equal(true);
    });

    it('should disable "searching" flag after search ends', async () => {
        
        // setup
        const store = createStore({
            rootProject: {
                id: '_Root',
                name: '<Root>',
                vis: {
                    visible: true,
                    collapsed: false
                },
                buildTypes: [],
                childProjects: []
            },
            filter: {
                projectIds: [],
                buildTypeIds: []
            }
        });

        // mock search call
        fetchMock = mockFetch.mock({json: () => ({
            tree: null, projectIds: [], buildTypeIds: []
        })});

        // target
        await store.dispatch(search('#FINDME#'));

        // check
        const state = store.getState();

        expect(state.search.running).to.equal(false);
    });

    it('should set search string while searching', async () => {
        
        // setup
        const store = createStore({
            rootProject: {
                id: '_Root',
                name: '<Root>',
                vis: {
                    visible: true,
                    collapsed: false
                },
                buildTypes: [],
                childProjects: []
            },
            filter: {
                projectIds: [],
                buildTypeIds: []
            }
        });

        // mock search call
        fetchMock = mockFetch.mock({json: () => ({
            tree: null, projectIds: [], buildTypeIds: []
        })});

        // target
        // not awaiting to catch filter state before rest api call
        store.dispatch(search('#FINDME#'));

        // check
        const state = store.getState();

        expect(state.search.str).to.equal('#FINDME#');
    });

    it('should remove search string if it is empty', async () => {
        
        // setup
        const store = createStore({
            rootProject: {
                id: '_Root',
                name: '<Root>',
                vis: {
                    visible: true,
                    collapsed: false
                },
                buildTypes: [],
                childProjects: []
            },
            filter: {
                projectIds: [],
                buildTypeIds: []
            }
        });

        // mock search call
        fetchMock = mockFetch.mock({json: () => ({
            tree: null, projectIds: [], buildTypeIds: []
        })});

        // target
        await store.dispatch(search(''));

        // check
        const state = store.getState();

        expect(state.search.str).to.equal(null);
    });

});