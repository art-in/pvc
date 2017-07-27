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
                        collapsed: false
                    }],
                    collapsed: false
                }
            });

            // target
            await store.dispatch(projects.collapseProject('proj-1'));

            // check
            const state = store.getState();

            let project = findProject(state.rootProject, '_Root');
            expect(project.collapsed).to.equal(false);

            project = findProject(state.rootProject, 'proj-1');
            expect(project.collapsed).to.equal(true);
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
                        collapsed: false
                    }],
                    collapsed: true
                }
            });

            // target
            await store.dispatch(projects.expandProject('_Root'));

            // check
            const state = store.getState();

            let project = findProject(state.rootProject, '_Root');
            expect(project.collapsed).to.equal(false);

            project = findProject(state.rootProject, 'proj-1');
            expect(project.collapsed).to.equal(false);
        });

    });

});