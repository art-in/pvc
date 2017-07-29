import {expect} from 'chai';

import * as mockFetch from '../../../utils/mock-fetch';
import createStore from './create-store';
import findProject from 'src/shared/utils/traversing/find-project';
import * as projects from 'src/client/state/projects/actions';

let fetchMock;

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
                    childProjectLoading: false,
                    childProjects: null
                }
            });

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
                    childProjects: null
                }
            });

            // target
            await store.dispatch(projects.loadChildren('_Root'));

            // check
            const state = store.getState();
            const rootProject = state.rootProject;
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
                    childProjects: null
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
                    childProjects: []
                }]
            })});

            // target
            await store.dispatch(projects.loadChildren('_Root'));

            // check
            const state = store.getState();
            const rootProject = state.rootProject;
            expect(rootProject.childrenLoading).to.equal.false;
            expect(rootProject.childProjects).to.deep.equal([{
                id: 'proj-1',
                vis: {
                    collapsed: false,
                    visible: true
                },
                childrenLoading: false,
                childProjects: []
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
                        vis: {
                            collapsed: false,
                            visible: true
                        }
                    }],
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

            let project = findProject(state.rootProject, '_Root');
            expect(project.vis.collapsed).to.equal(false);

            project = findProject(state.rootProject, 'proj-1');
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
                        vis: {
                            collapsed: false,
                            visible: true
                        }
                    }],
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
                        vis: {
                            collapsed: false,
                            visible: true
                        }
                    }],
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

            let project = findProject(state.rootProject, '_Root');
            expect(project.vis.collapsed).to.equal(false);

            project = findProject(state.rootProject, 'proj-1');
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
                        vis: {
                            collapsed: false,
                            visible: true
                        }
                    }],
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
                    childProjects: null
                }
            });

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

        it('should collapse all visible projects if not configuration',
            async () => {

                // setup
                const store = createStore({
                    rootProject: {
                        id: '_Root',
                        childProjects: [{
                            id: 'proj-1',
                            childProjects: [],
                            vis: {
                                collapsed: false,
                                visible: true
                            }
                        }, {
                            id: 'proj-2',
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
                    },
                    isConfiguringVisibility: false
                });

                // target
                await store.dispatch(projects.collapseAll());

                // check
                const state = store.getState();

                let project = state.rootProject;
                expect(project.vis.collapsed).to.equal(true);

                project = findProject(state.rootProject, 'proj-1');
                expect(project.vis.collapsed).to.equal(true);

                project = findProject(state.rootProject, 'proj-2');
                expect(project.vis.collapsed).to.equal(false);
            });

        it('should collapse all projects if configuration',
            async () => {

                // setup
                const store = createStore({
                    rootProject: {
                        id: '_Root',
                        childProjects: [{
                            id: 'proj-1',
                            childProjects: [],
                            vis: {
                                collapsed: false,
                                visible: true
                            }
                        }, {
                            id: 'proj-2',
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
                    },
                    isConfiguringVisibility: true
                });

                // target
                await store.dispatch(projects.collapseAll());

                // check
                const state = store.getState();

                let project = state.rootProject;
                expect(project.vis.collapsed).to.equal(true);

                project = findProject(state.rootProject, 'proj-1');
                expect(project.vis.collapsed).to.equal(true);

                project = findProject(state.rootProject, 'proj-2');
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
                        vis: {
                            collapsed: false,
                            visible: true
                        }
                    }, {
                        id: 'proj-2',
                        childProjects: [],
                        vis: {
                            collapsed: false,
                            visible: true
                        }
                    }],
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

        it('should expand all visible projects if not configuration',
            async () => {

                // setup
                const store = createStore({
                    rootProject: {
                        id: '_Root',
                        childProjects: [{
                            id: 'proj-1',
                            childProjects: [],
                            vis: {
                                collapsed: true,
                                visible: true
                            }
                        }, {
                            id: 'proj-2',
                            childProjects: [],
                            vis: {
                                collapsed: true,
                                visible: false
                            }
                        }],
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

                let project = state.rootProject;
                expect(project.vis.collapsed).to.equal(false);

                project = findProject(state.rootProject, 'proj-1');
                expect(project.vis.collapsed).to.equal(false);

                project = findProject(state.rootProject, 'proj-2');
                expect(project.vis.collapsed).to.equal(true);
            });

        it('should expand all projects if configuration',
            async () => {

                // setup
                const store = createStore({
                    rootProject: {
                        id: '_Root',
                        childProjects: [{
                            id: 'proj-1',
                            childProjects: [],
                            vis: {
                                collapsed: true,
                                visible: true
                            }
                        }, {
                            id: 'proj-2',
                            childProjects: [],
                            vis: {
                                collapsed: true,
                                visible: false
                            }
                        }],
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

                let project = state.rootProject;
                expect(project.vis.collapsed).to.equal(false);

                project = findProject(state.rootProject, 'proj-1');
                expect(project.vis.collapsed).to.equal(false);

                project = findProject(state.rootProject, 'proj-2');
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
                        vis: {
                            collapsed: true,
                            visible: true
                        }
                    }, {
                        id: 'proj-2',
                        childProjects: [],
                        vis: {
                            collapsed: true,
                            visible: true
                        }
                    }],
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
                    childProjects: [{
                        id: 'proj-1',
                        vis: {
                            collapsed: false,
                            visible: false
                        },
                        parentProjectId: '_Root',
                        childProjects: [{
                            id: 'proj-1-a',
                            vis: {
                                collapsed: false,
                                visible: false
                            },
                            parentProjectId: 'proj-1',
                            childProjects: []
                        }]
                    }, {
                        id: 'proj-2',
                        vis: {
                            collapsed: false,
                            visible: false
                        },
                        parentProjectId: '_Root',
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
                    childProjects: [{
                        id: 'proj-1',
                        vis: {
                            collapsed: false,
                            visible: false
                        },
                        parentProjectId: '_Root',
                        childProjects: [{
                            id: 'proj-1-a',
                            vis: {
                                collapsed: false,
                                visible: false
                            },
                            parentProjectId: 'proj-1',
                            childProjects: []
                        }]
                    }, {
                        id: 'proj-2',
                        vis: {
                            collapsed: false,
                            visible: false
                        },
                        parentProjectId: '_Root',
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
        });

        it('should call rest api', async () => {
            // setup
            const store = createStore({
                rootProject: {
                    id: '_Root',
                    childProjects: [{
                        id: 'proj-1',
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
                    childProjects: [{
                        id: 'proj-1',
                        vis: {
                            collapsed: false,
                            visible: true
                        },
                        parentProjectId: '_Root',
                        childProjects: [{
                            id: 'proj-1-a',
                            vis: {
                                collapsed: false,
                                visible: true
                            },
                            parentProjectId: 'proj-1',
                            childProjects: []
                        }]
                    }, {
                        id: 'proj-2',
                        vis: {
                            collapsed: false,
                            visible: true
                        },
                        parentProjectId: '_Root',
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
        });

        it('should call rest api', async () => {
            // setup
            const store = createStore({
                rootProject: {
                    id: '_Root',
                    childProjects: [{
                        id: 'proj-1',
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
            const store = createStore({
                rootProject: {
                    id: '_Root',
                    vis: {
                        collapsed: false,
                        visible: true
                    },
                    childProjects: [{
                        id: 'proj-1',
                        vis: {
                            collapsed: false,
                            visible: true
                        },
                        parentProjectId: '_Root',
                        childProjects: []
                    }, {
                        id: 'proj-2',
                        vis: {
                            collapsed: false,
                            visible: true
                        },
                        parentProjectId: '_Root',
                        childProjects: []
                    }]
                }
            });

            // target
            await store.dispatch(projects.moveProjectUp('proj-2'));

            // check
            const state = store.getState();
            const root = state.rootProject;

            expect(root.childProjects).to.have.length(2);
            expect(root.childProjects[0].id).to.equal('proj-2');
            expect(root.childProjects[1].id).to.equal('proj-1');
        });

        it('should skip if project is first', async () => {

            // setup
            const store = createStore({
                rootProject: {
                    id: '_Root',
                    vis: {
                        collapsed: false,
                        visible: true
                    },
                    childProjects: [{
                        id: 'proj-1',
                        vis: {
                            collapsed: false,
                            visible: true
                        },
                        parentProjectId: '_Root',
                        childProjects: []
                    }, {
                        id: 'proj-2',
                        vis: {
                            collapsed: false,
                            visible: true
                        },
                        parentProjectId: '_Root',
                        childProjects: []
                    }]
                }
            });

            // target
            await store.dispatch(projects.moveProjectUp('proj-1'));

            // check
            const state = store.getState();
            const root = state.rootProject;

            expect(root.childProjects).to.have.length(2);
            expect(root.childProjects[0].id).to.equal('proj-1');
            expect(root.childProjects[1].id).to.equal('proj-2');
        });

        it('should call rest api', async () => {
            // setup
            const store = createStore({
                rootProject: {
                    id: '_Root',
                    vis: {
                        collapsed: false,
                        visible: true
                    },
                    childProjects: [{
                        id: 'proj-1',
                        vis: {
                            collapsed: false,
                            visible: true
                        },
                        parentProjectId: '_Root',
                        childProjects: []
                    }, {
                        id: 'proj-2',
                        vis: {
                            collapsed: false,
                            visible: true
                        },
                        parentProjectId: '_Root',
                        childProjects: []
                    }]
                }
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
            const store = createStore({
                rootProject: {
                    id: '_Root',
                    vis: {
                        collapsed: false,
                        visible: true
                    },
                    childProjects: [{
                        id: 'proj-1',
                        vis: {
                            collapsed: false,
                            visible: true
                        },
                        parentProjectId: '_Root',
                        childProjects: []
                    }, {
                        id: 'proj-2',
                        vis: {
                            collapsed: false,
                            visible: true
                        },
                        parentProjectId: '_Root',
                        childProjects: []
                    }]
                }
            });

            // target
            await store.dispatch(projects.moveProjectDown('proj-1'));

            // check
            const state = store.getState();
            const root = state.rootProject;

            expect(root.childProjects).to.have.length(2);
            expect(root.childProjects[0].id).to.equal('proj-2');
            expect(root.childProjects[1].id).to.equal('proj-1');
        });

        it('should skip if project is last', async () => {

            // setup
            const store = createStore({
                rootProject: {
                    id: '_Root',
                    vis: {
                        collapsed: false,
                        visible: true
                    },
                    childProjects: [{
                        id: 'proj-1',
                        vis: {
                            collapsed: false,
                            visible: true
                        },
                        parentProjectId: '_Root',
                        childProjects: []
                    }, {
                        id: 'proj-2',
                        vis: {
                            collapsed: false,
                            visible: true
                        },
                        parentProjectId: '_Root',
                        childProjects: []
                    }]
                }
            });

            // target
            await store.dispatch(projects.moveProjectDown('proj-2'));

            // check
            const state = store.getState();
            const root = state.rootProject;

            expect(root.childProjects).to.have.length(2);
            expect(root.childProjects[0].id).to.equal('proj-1');
            expect(root.childProjects[1].id).to.equal('proj-2');
        });

        it('should call rest api', async () => {
            // setup
            const store = createStore({
                rootProject: {
                    id: '_Root',
                    vis: {
                        collapsed: false,
                        visible: true
                    },
                    childProjects: [{
                        id: 'proj-1',
                        vis: {
                            collapsed: false,
                            visible: true
                        },
                        parentProjectId: '_Root',
                        childProjects: []
                    }, {
                        id: 'proj-2',
                        vis: {
                            collapsed: false,
                            visible: true
                        },
                        parentProjectId: '_Root',
                        childProjects: []
                    }]
                }
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
            const store = createStore({
                rootProject: {
                    id: '_Root',
                    vis: {
                        collapsed: false,
                        visible: true
                    },
                    childProjects: [{
                        id: 'proj-1',
                        vis: {
                            collapsed: false,
                            visible: true
                        },
                        parentProjectId: '_Root',
                        childProjects: []
                    }, {
                        id: 'proj-2',
                        vis: {
                            collapsed: false,
                            visible: true
                        },
                        parentProjectId: '_Root',
                        childProjects: []
                    }, {
                        id: 'proj-3',
                        vis: {
                            collapsed: false,
                            visible: true
                        },
                        parentProjectId: '_Root',
                        childProjects: []
                    }]
                }
            });

            // target
            await store.dispatch(projects.moveProject('_Root', 0, 2));

            // check
            const state = store.getState();
            const root = state.rootProject;

            expect(root.childProjects).to.have.length(3);
            expect(root.childProjects[0].id).to.equal('proj-2');
            expect(root.childProjects[1].id).to.equal('proj-3');
            expect(root.childProjects[2].id).to.equal('proj-1');
        });

        it('should not move project outside right border', async () => {

            // setup
            const store = createStore({
                rootProject: {
                    id: '_Root',
                    vis: {
                        collapsed: false,
                        visible: true
                    },
                    childProjects: [{
                        id: 'proj-1',
                        vis: {
                            collapsed: false,
                            visible: true
                        },
                        parentProjectId: '_Root',
                        childProjects: []
                    }, {
                        id: 'proj-2',
                        vis: {
                            collapsed: false,
                            visible: true
                        },
                        parentProjectId: '_Root',
                        childProjects: []
                    }, {
                        id: 'proj-3',
                        vis: {
                            collapsed: false,
                            visible: true
                        },
                        parentProjectId: '_Root',
                        childProjects: []
                    }]
                }
            });

            // target
            await store.dispatch(projects.moveProject('_Root', 0, 100));

            // check
            const state = store.getState();
            const root = state.rootProject;

            expect(root.childProjects).to.have.length(3);
            expect(root.childProjects[0].id).to.equal('proj-2');
            expect(root.childProjects[1].id).to.equal('proj-3');
            expect(root.childProjects[2].id).to.equal('proj-1');
        });

        it('should not move project outside left border', async () => {

            // setup
            const store = createStore({
                rootProject: {
                    id: '_Root',
                    vis: {
                        collapsed: false,
                        visible: true
                    },
                    childProjects: [{
                        id: 'proj-1',
                        vis: {
                            collapsed: false,
                            visible: true
                        },
                        parentProjectId: '_Root',
                        childProjects: []
                    }, {
                        id: 'proj-2',
                        vis: {
                            collapsed: false,
                            visible: true
                        },
                        parentProjectId: '_Root',
                        childProjects: []
                    }, {
                        id: 'proj-3',
                        vis: {
                            collapsed: false,
                            visible: true
                        },
                        parentProjectId: '_Root',
                        childProjects: []
                    }]
                }
            });

            // target
            await store.dispatch(projects.moveProject('_Root', 2, -100));

            // check
            const state = store.getState();
            const root = state.rootProject;

            expect(root.childProjects).to.have.length(3);
            expect(root.childProjects[0].id).to.equal('proj-3');
            expect(root.childProjects[1].id).to.equal('proj-1');
            expect(root.childProjects[2].id).to.equal('proj-2');
        });

        it('should call rest api', async () => {
            
            // setup
            const store = createStore({
                rootProject: {
                    id: '_Root',
                    vis: {
                        collapsed: false,
                        visible: true
                    },
                    childProjects: [{
                        id: 'proj-1',
                        vis: {
                            collapsed: false,
                            visible: true
                        },
                        parentProjectId: '_Root',
                        childProjects: []
                    }, {
                        id: 'proj-2',
                        vis: {
                            collapsed: false,
                            visible: true
                        },
                        parentProjectId: '_Root',
                        childProjects: []
                    }, {
                        id: 'proj-3',
                        vis: {
                            collapsed: false,
                            visible: true
                        },
                        parentProjectId: '_Root',
                        childProjects: []
                    }]
                }
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

});