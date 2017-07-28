import {expect} from 'chai';

import createStore from './create-store';
import findProject from 'src/shared/utils/traversing/find-project';
import * as projects from 'src/client/state/projects/actions';

describe('projects', () => {

    describe('collapseProject', () => {

        it('should set project.collapsed to true', async () => {

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

    });

    describe('expandProject', () => {

        it('should set project.collapsed to false', async () => {

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

    });

});