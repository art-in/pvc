import React from 'react';
import {mount} from 'enzyme';
import {expect} from 'chai';
import {Provider} from 'react-redux';
import mockStore from 'test/utils/mock-store';

import Project from 'src/client/components/Project';

describe('Project', () => {

    it('should be rendered', () => {

        // setup
        const store = mockStore({
            visibleRootProject: {
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
            visibleRootProject: {
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
        const target = wrapper.find('.ProjectHeader-name');
        expect(target).to.have.length(1);
        expect(target.text()).to.equal('<Root project>');
    });

    it('should highlight search string in project name', () => {
        
        // setup
        const store = mockStore({
            visibleRootProject: {
                id: '_Root',
                name: '<Root project>',
                childProjects: [],
                buildTypes: [],
                vis: {
                    collapsed: false,
                    visible: true
                }
            },
            isConfiguringVisibility: false,
            search: {
                str: 'project'
            }
        });

        // target
        const wrapper = mount(
            <Provider store={store}>
                <Project projectId={'_Root'} />
            </Provider>
        );
        
        // check
        const target = wrapper.find('.Marker-highlight');
        expect(target).to.have.length(1);
        expect(target.text()).to.equal('project');
    });

    it('should render child projects', () => {

        // setup
        const store = mockStore({
            visibleRootProject: {
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
        const targetName = wrapper.find('.ProjectHeader-name');
        expect(targetName).to.have.length(2);
        expect(targetName.at(0).text()).to.equal('<Root project>');

        const targetChildProjects = wrapper
            .find('.Project-child-projects .Project-root');
        expect(targetChildProjects).to.have.length(1);
        expect(targetChildProjects.at(0)
            .find('.ProjectHeader-name').text()).to.equal('Project 1');
    });

    it('should render build types', () => {

        // setup
        const store = mockStore({
            visibleRootProject: {
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
        expect(target.at(0).text()).to.equal('Build 1');
        expect(target.at(1).text()).to.equal('Build 2');
    });

    it('should highlight search string in build type names', () => {

        // setup
        const store = mockStore({
            visibleRootProject: {
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
            isConfiguringVisibility: false,
            search: {
                str: 'Build'
            }
        });

        // target
        const wrapper = mount(
            <Provider store={store}>
                <Project projectId={'_Root'} />
            </Provider>
        );
        
        // check
        const target = wrapper.find('.Project-build-types .Marker-highlight');
        expect(target).to.have.length(2);
        expect(target.at(0).text()).to.equal('Build');
        expect(target.at(1).text()).to.equal('Build');
    });

    it('should not render children if collapsed', () => {
        // setup
        const store = mockStore({
            visibleRootProject: {
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

    it('should render config section in config mode', () => {

        // setup
        const store = mockStore({
            visibleRootProject: {
                id: '_Root',
                name: '<Root project>',
                childProjects: [],
                buildTypes: [],
                vis: {
                    collapsed: true,
                    visible: true
                }
            },
            isConfiguringVisibility: true
        });

        // target
        const wrapper = mount(
            <Provider store={store}>
                <Project projectId={'_Root'} />
            </Provider>
        );

        // check
        const target = wrapper.find('.ProjectHeader-config');
        expect(target).to.have.length(1);
    });

    it('should not render config section in non-config mode', () => {
        
        // setup
        const store = mockStore({
            visibleRootProject: {
                id: '_Root',
                name: '<Root project>',
                childProjects: [],
                buildTypes: [],
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
        const target = wrapper.find('.Project-config');
        expect(target).to.have.length(0);
    });

    it('should render waiter when loading children', () => {

        // setup
        const store = mockStore({
            visibleRootProject: {
                id: '_Root',
                name: '<Root project>',
                vis: {
                    collapsed: false,
                    visible: true
                },
                childrenLoading: true,
                childProjects: null,
                buildTypes: null
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
        const target = wrapper.find('.Waiter-root');
        expect(target).to.have.length(1);
    });

    it('should not render waiter when not loading children', () => {

        // setup
        const store = mockStore({
            visibleRootProject: {
                id: '_Root',
                name: '<Root project>',
                vis: {
                    collapsed: false,
                    visible: true
                },
                childrenLoading: false,
                childProjects: [],
                buildTypes: []
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
        const target = wrapper.find('.Waiter-root');
        expect(target).to.have.length(0);
    });

    it('should expand projects when filtering', () => {
        
        // setup
        const store = mockStore({
            visibleRootProject: {
                id: '_Root',
                name: '<Root project>',
                vis: {
                    collapsed: true,
                    visible: true
                },
                childProjects: [{
                    id: 'proj-1',
                    name: 'proj-1',
                    parentProjectId: '_Root',
                    vis: {
                        collapsed: true,
                        visible: true
                    },
                    childProjects: [],
                    buildTypes: [{
                        id: 'build-1',
                        name: 'build-1'
                    }]
                }],
                buildTypes: []
            },
            isConfiguringVisibility: false,
            filter: {
                projectIds: ['_Root', 'proj-1']
            }
        });

        // target
        const wrapper = mount(
            <Provider store={store}>
                <Project projectId={'_Root'} />
            </Provider>
        );

        // check
        const projects = wrapper.find('.Project-root');
        expect(projects).to.have.length(2);

        const buildTypes = wrapper.find('.BuildType-root');
        expect(buildTypes).to.have.length(1);
    });

});