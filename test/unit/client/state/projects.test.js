import {expect} from 'chai';

import * as mockFetch from '../../../utils/mock-fetch';
import createStore from 'test/utils/create-store';
import findProject from 'src/shared/utils/traversing/find-project';
import * as projects from 'src/client/state/projects/actions';

let fetchMock;

// TODO: split up actions to separate files

describe('projects', () => {

    beforeEach(() => {
        fetchMock = mockFetch.mock();
    });

    after(() => {
        mockFetch.restore();
    });

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
            await store.dispatch(projects.loadChildren('_Root'));

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
            await store.dispatch(projects.loadChildren('_Root'));

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
            await store.dispatch(projects.loadChildren('_Root'));

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

    describe('collapseProject', () => {

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
            await store.dispatch(projects.collapseProject('proj-1'));

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
            await store.dispatch(projects.collapseProject('proj-1'));

            // check
            expect(fetchMock.calledOnce).to.equal(true);
            const params = fetchMock.firstCall.args;
            expect(params[0]).to.match(
                /api\/projects\/proj-1\/vis\/collapsed\?session=.+/);
            expect(params[1].method).to.equal('PUT');
        });

    });

    describe('expandProject', () => {

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
            await store.dispatch(projects.expandProject('_Root'));

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
            await store.dispatch(projects.expandProject('proj-1'));

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
            await store.dispatch(projects.expandProject('_Root'));

            // check
            expect(fetchMock.callCount).to.equal(2);
            const params = fetchMock.secondCall.args;
            expect(params[0]).to.match(
                /\/projects\/_Root\/children\?session=.+/);
            expect(params[1].method).to.equal('GET');
        });

    });

    describe('collapseAll', () => {

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
                await store.dispatch(projects.collapseAll());

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
                await store.dispatch(projects.collapseAll());

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
            await store.dispatch(projects.collapseAll());

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

    describe('expandAll', () => {

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
                await store.dispatch(projects.expandAll());

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
                await store.dispatch(projects.expandAll());

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
            await store.dispatch(projects.expandAll());

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

    describe('showProject', () => {

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
            await store.dispatch(projects.showProject('proj-1-a'));

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
            await store.dispatch(projects.showProject('proj-1'));

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
            await store.dispatch(projects.showProject('proj-1-a'));

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
            await store.dispatch(projects.showProject('proj-1'));

            // check
            expect(fetchMock.calledOnce).to.equal(true);
            const params = fetchMock.firstCall.args;
            expect(params[0]).to.match(
                /api\/projects\/proj-1\/vis\/visible\?session=.+/);
            expect(params[1].method).to.equal('PUT');
        });

    });

    describe('hideProject', () => {

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
            await store.dispatch(projects.hideProject('proj-1'));

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
            await store.dispatch(projects.hideProject('proj-1'));

            // check
            expect(fetchMock.calledOnce).to.equal(true);
            const params = fetchMock.firstCall.args;
            expect(params[0]).to.match(
                /api\/projects\/proj-1\/vis\/visible\?session=.+/);
            expect(params[1].method).to.equal('DELETE');
        });
    });

    describe('moveProjectUp', () => {

        it('should move project one position up', async () => {

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
                }]
            };

            const store = createStore({
                rootProject,
                visibleRootProject: rootProject
            });

            // target
            await store.dispatch(projects.moveProjectUp('proj-2'));

            // check
            const state = store.getState();
            const root = state.visibleRootProject;

            expect(root.childProjects).to.have.length(2);
            expect(root.childProjects[0].id).to.equal('proj-2');
            expect(root.childProjects[1].id).to.equal('proj-1');
        });

        it('should skip if project is first', async () => {

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
                }]
            };

            const store = createStore({
                rootProject,
                visibleRootProject: rootProject
            });

            // target
            await store.dispatch(projects.moveProjectUp('proj-1'));

            // check
            const state = store.getState();
            const root = state.visibleRootProject;

            expect(root.childProjects).to.have.length(2);
            expect(root.childProjects[0].id).to.equal('proj-1');
            expect(root.childProjects[1].id).to.equal('proj-2');
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
            await store.dispatch(projects.moveProjectUp('proj-3'));

            // check
            const state = store.getState();
            const root = state.rootProject;

            expect(root.childProjects).to.have.length(3);
            expect(root.childProjects[0].id).to.equal('proj-3');
            expect(root.childProjects[1].id).to.equal('proj-1');
            expect(root.childProjects[2].id).to.equal('proj-2');

            const visibleRoot = state.visibleRootProject;
            expect(visibleRoot.childProjects).to.have.length(2);
            expect(visibleRoot.childProjects[0].id).to.equal('proj-3');
            expect(visibleRoot.childProjects[1].id).to.equal('proj-1');
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
                }]
            };

            const store = createStore({
                rootProject,
                visibleRootProject: rootProject
            });

            // target
            await store.dispatch(projects.moveProjectUp('proj-2'));

            // check
            expect(fetchMock.calledOnce).to.equal(true);
            const params = fetchMock.firstCall.args;
            expect(params[0]).to.match(
                /api\/projects\/_Root\/child-projects\/positions\?session=.+/);
            expect(params[1].method).to.equal('PATCH');
            expect(params[1].body).to.equal(JSON.stringify({
                oldIdx: 1,
                newIdx: 0
            }));
        });

    });

    describe('moveProjectDown', () => {

        it('should move project one position down', async () => {

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
                }]
            };

            const store = createStore({
                rootProject,
                visibleRootProject: rootProject
            });

            // target
            await store.dispatch(projects.moveProjectDown('proj-1'));

            // check
            const state = store.getState();
            const root = state.visibleRootProject;

            expect(root.childProjects).to.have.length(2);
            expect(root.childProjects[0].id).to.equal('proj-2');
            expect(root.childProjects[1].id).to.equal('proj-1');
        });

        it('should skip if project is last', async () => {

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
                }]
            };

            const store = createStore({
                rootProject,
                visibleRootProject: rootProject
            });

            // target
            await store.dispatch(projects.moveProjectDown('proj-2'));

            // check
            const state = store.getState();
            const root = state.visibleRootProject;

            expect(root.childProjects).to.have.length(2);
            expect(root.childProjects[0].id).to.equal('proj-1');
            expect(root.childProjects[1].id).to.equal('proj-2');
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
            await store.dispatch(projects.moveProjectDown('proj-1'));

            // check
            const state = store.getState();
            const root = state.rootProject;

            expect(root.childProjects).to.have.length(3);
            expect(root.childProjects[0].id).to.equal('proj-2');
            expect(root.childProjects[1].id).to.equal('proj-3');
            expect(root.childProjects[2].id).to.equal('proj-1');

            const visibleRoot = state.visibleRootProject;
            expect(visibleRoot.childProjects).to.have.length(2);
            expect(visibleRoot.childProjects[0].id).to.equal('proj-3');
            expect(visibleRoot.childProjects[1].id).to.equal('proj-1');
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
                }]
            };

            const store = createStore({
                rootProject,
                visibleRootProject: rootProject
            });

            // target
            await store.dispatch(projects.moveProjectDown('proj-1'));

            // check
            expect(fetchMock.calledOnce).to.equal(true);
            const params = fetchMock.firstCall.args;
            expect(params[0]).to.match(
                /api\/projects\/_Root\/child-projects\/positions\?session=.+/);
            expect(params[1].method).to.equal('PATCH');
            expect(params[1].body).to.equal(JSON.stringify({
                oldIdx: 0,
                newIdx: 1
            }));
        });

    });

    describe('moveProject', () => {

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
            await store.dispatch(projects.moveProject('_Root', 0, 2));

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
            await store.dispatch(projects.moveProject('_Root', 0, 100));

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
            await store.dispatch(projects.moveProject('_Root', 2, -100));

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
            await store.dispatch(projects.moveProject('_Root', 0, 1));

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
            await store.dispatch(projects.moveProject('_Root', 0, 2));

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

    describe('search', () => {

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
            store.dispatch(projects.search('#FINDME#'));

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
            await store.dispatch(projects.search('#FINDME#'));

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
            await store.dispatch(projects.search('#FINDME#'));

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
            await store.dispatch(projects.search('#FINDME#'));

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
            store.dispatch(projects.search('#FINDME#'));

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
            await store.dispatch(projects.search('#FINDME#'));

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
            store.dispatch(projects.search('#FINDME#'));

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
            await store.dispatch(projects.search(''));

            // check
            const state = store.getState();

            expect(state.search.str).to.equal(null);
        });

    });

});