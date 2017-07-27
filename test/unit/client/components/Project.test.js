import React from 'react';
import {mount} from 'enzyme';
import {expect} from 'chai';
import configureStore from 'redux-mock-store';
import {Provider} from 'react-redux';

import Project from 'src/client/components/Project';

const mockStore = configureStore();

describe('Project', () => {

    it('should be rendered', () => {

        // setup
        const store = mockStore({
            rootProject: {
                id: '_Root',
                name: '<Root project>',
                childProjects: [],
                buildTypes: [],
                vis: {
                    collapsed: false,
                    visible: true
                }
            },
            isConfiguringVisibility: false
        });

        // target
        const wrapper = mount(
            <Provider store={store}>
                <Project projectId={'_Root'} />
            </Provider>
        );
        
        // check
        expect(wrapper).to.exist;
    });

    it('should render project name', () => {
        
        // setup
        const store = mockStore({
            rootProject: {
                id: '_Root',
                name: '<Root project>',
                childProjects: [],
                buildTypes: [],
                vis: {
                    collapsed: false,
                    visible: true
                }
            },
            isConfiguringVisibility: false
        });

        // target
        const wrapper = mount(
            <Provider store={store}>
                <Project projectId={'_Root'} />
            </Provider>
        );
        
        // check
        const target = wrapper.find('.Project-name');
        expect(target).to.have.length(1);
        expect(target.text()).to.equal('<Root project>');
    });

    it('should render child projects', () => {

        // setup
        const store = mockStore({
            rootProject: {
                id: '_Root',
                name: '<Root project>',
                childProjects: [{
                    id: 'proj-1',
                    name: 'Project 1',
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
            isConfiguringVisibility: false
        });

        // target
        const wrapper = mount(
            <Provider store={store}>
                <Project projectId={'_Root'} />
            </Provider>
        );
        
        // check
        const targetName = wrapper.find('.Project-name');
        expect(targetName).to.have.length(2);
        expect(targetName.at(0).text()).to.equal('<Root project>');

        const targetChildProjects = wrapper
            .find('.Project-child-projects .Project-root');
        expect(targetChildProjects).to.have.length(1);
        expect(targetChildProjects.at(0)
            .find('.Project-name').text()).to.equal('Project 1');
    });

    it('should render build types', () => {

        // setup
        const store = mockStore({
            rootProject: {
                id: '_Root',
                name: '<Root project>',
                childProjects: [],
                buildTypes: [{
                    id: 'build_1',
                    name: 'Build 1'
                }, {
                    id: 'build_2',
                    name: 'Build 2'
                }],
                vis: {
                    collapsed: false,
                    visible: true
                }
            },
            isConfiguringVisibility: false
        });

        // target
        const wrapper = mount(
            <Provider store={store}>
                <Project projectId={'_Root'} />
            </Provider>
        );
        
        // check
        const target = wrapper.find('.Project-build-types .BuildType-root');
        expect(target).to.have.length(2);
        expect(target.at(0).text()).to.equal('BUILD: Build 1');
        expect(target.at(1).text()).to.equal('BUILD: Build 2');
    });

    it('should not render children if collapsed', () => {
        // setup
        const store = mockStore({
            rootProject: {
                id: '_Root',
                name: '<Root project>',
                childProjects: [{
                    id: 'proj-1',
                    name: 'Project 1',
                    childProjects: [],
                    buildTypes: [],
                    vis: {
                        collapsed: false,
                        visible: true
                    }
                }],
                buildTypes: [{
                    id: 'build_1',
                    name: 'Build 1'
                }],
                vis: {
                    collapsed: true,
                    visible: true
                }
            },
            isConfiguringVisibility: false
        });

        // target
        const wrapper = mount(
            <Provider store={store}>
                <Project projectId={'_Root'} />
            </Provider>
        );

        // check
        const builds = wrapper.find('.Project-build-types .BuildType-root');
        const projs = wrapper.find('.Project-child-projects .Project-root');

        expect(builds).to.have.length(0);
        expect(projs).to.have.length(0);
    });

});