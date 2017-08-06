import {expect} from 'chai';
import filterVisible from 'src/shared/utils/traversing/filter-visible';

describe('filter-visible', () => {

    it('should remove projects hidden by own visibility config', () => {
        
        // setup
        const tree = {
            id: '_Root',
            name: '<Root>',
            vis: {
                visible: true,
                collapsed: false
            },
            buildTypes: [],
            childProjects: [{
                id: 'proj-1',
                name: 'proj-1',
                vis: {
                    visible: true,
                    collapsed: false
                },
                parentProjectId: '_Root',
                buildTypes: [{
                    id: 'build-1-a',
                    name: 'build-1-a'
                }],
                childProjects: []
            }, {
                id: 'proj-2',
                name: 'proj-2',
                vis: {
                    visible: false,
                    collapsed: false
                },
                parentProjectId: '_Root',
                buildTypes: [{
                    id: 'build-2-a',
                    name: 'build-2-a'
                }, {
                    id: 'build-2-b',
                    name: 'build-2-b'
                }],
                childProjects: []
            }]
        };

        const filter = {
            projectIds: null,
            buildTypeIds: null
        };

        // target
        const target = filterVisible(tree, filter);

        // check
        expect(target).to.exist;
        expect(target).to.deep.equal({
            id: '_Root',
            name: '<Root>',
            vis: {
                visible: true,
                collapsed: false
            },
            buildTypes: [],
            childProjects: [{
                id: 'proj-1',
                name: 'proj-1',
                vis: {
                    visible: true,
                    collapsed: false
                },
                parentProjectId: '_Root',
                buildTypes: [{
                    id: 'build-1-a',
                    name: 'build-1-a'
                }],
                childProjects: []
            }]
        });
    });

    it('should not remove projects hidden by config if in config mode', () => {

        // setup
        const tree = {
            id: '_Root',
            name: '<Root>',
            vis: {
                visible: true,
                collapsed: false
            },
            buildTypes: [],
            childProjects: [{
                id: 'proj-1',
                name: 'proj-1',
                vis: {
                    visible: true,
                    collapsed: false
                },
                parentProjectId: '_Root',
                buildTypes: [{
                    id: 'build-1-a',
                    name: 'build-1-a'
                }],
                childProjects: []
            }, {
                id: 'proj-2',
                name: 'proj-2',
                vis: {
                    visible: false,
                    collapsed: false
                },
                parentProjectId: '_Root',
                buildTypes: [{
                    id: 'build-2-a',
                    name: 'build-2-a'
                }, {
                    id: 'build-2-b',
                    name: 'build-2-b'
                }],
                childProjects: []
            }]
        };

        const filter = {
            projectIds: null,
            buildTypeIds: null
        };

        // target
        const target = filterVisible(tree, filter, true);

        // check
        expect(target).to.exist;
        expect(target).to.deep.equal({
            id: '_Root',
            name: '<Root>',
            vis: {
                visible: true,
                collapsed: false
            },
            buildTypes: [],
            childProjects: [{
                id: 'proj-1',
                name: 'proj-1',
                vis: {
                    visible: true,
                    collapsed: false
                },
                parentProjectId: '_Root',
                buildTypes: [],
                childProjects: []
            }, {
                id: 'proj-2',
                name: 'proj-2',
                vis: {
                    visible: false,
                    collapsed: false
                },
                parentProjectId: '_Root',
                buildTypes: [],
                childProjects: []
            }]
        });

    });

    it('should remove collapsed projects', () => {
        
        // setup
        const tree = {
            id: '_Root',
            name: '<Root>',
            vis: {
                visible: true,
                collapsed: false
            },
            buildTypes: [],
            childProjects: [{
                id: 'proj-1',
                name: 'proj-1',
                vis: {
                    visible: true,
                    collapsed: true
                },
                parentProjectId: '_Root',
                buildTypes: [{
                    id: 'build-1',
                    name: 'build-1'
                }],
                childProjects: [{
                    id: 'proj-1-a',
                    name: 'proj-1-a',
                    vis: {
                        visible: true,
                        collapsed: false
                    },
                    parentProjectId: '_Root',
                    buildTypes: [{
                        id: 'build-1-a',
                        name: 'build-1-a'
                    }],
                    childProjects: []
                }]
            }, {
                id: 'proj-2',
                name: 'proj-2',
                vis: {
                    visible: true,
                    collapsed: false
                },
                parentProjectId: '_Root',
                buildTypes: [{
                    id: 'build-2-a',
                    name: 'build-2-a'
                }, {
                    id: 'build-2-b',
                    name: 'build-2-b'
                }],
                childProjects: []
            }]
        };

        const filter = {
            projectIds: null,
            buildTypeIds: null
        };

        // target
        const target = filterVisible(tree, filter);

        // check
        expect(target).to.exist;
        expect(target).to.deep.equal({
            id: '_Root',
            name: '<Root>',
            vis: {
                visible: true,
                collapsed: false
            },
            buildTypes: [],
            childProjects: [{
                id: 'proj-1',
                name: 'proj-1',
                vis: {
                    visible: true,
                    collapsed: true
                },
                parentProjectId: '_Root',
                buildTypes: null,
                childProjects: null
            }, {
                id: 'proj-2',
                name: 'proj-2',
                vis: {
                    visible: true,
                    collapsed: false
                },
                parentProjectId: '_Root',
                buildTypes: [{
                    id: 'build-2-a',
                    name: 'build-2-a'
                }, {
                    id: 'build-2-b',
                    name: 'build-2-b'
                }],
                childProjects: []
            }]
        });
    });

    it('should not remove collapsed projects if filtering', () => {
        
        // setup
        const tree = {
            id: '_Root',
            name: '<Root>',
            vis: {
                visible: true,
                collapsed: false
            },
            buildTypes: [],
            childProjects: [{
                id: 'proj-1',
                name: 'proj-1',
                vis: {
                    visible: true,
                    collapsed: true
                },
                parentProjectId: '_Root',
                buildTypes: [{
                    id: 'build-1',
                    name: 'build-1'
                }],
                childProjects: [{
                    id: 'proj-1-a',
                    name: 'proj-1-a',
                    vis: {
                        visible: true,
                        collapsed: false
                    },
                    parentProjectId: '_Root',
                    buildTypes: [{
                        id: 'build-1-a',
                        name: 'build-1-a'
                    }],
                    childProjects: []
                }]
            }, {
                id: 'proj-2',
                name: 'proj-2',
                vis: {
                    visible: true,
                    collapsed: false
                },
                parentProjectId: '_Root',
                buildTypes: [{
                    id: 'build-2-a',
                    name: 'build-2-a'
                }, {
                    id: 'build-2-b',
                    name: 'build-2-b'
                }],
                childProjects: []
            }]
        };

        const filter = {
            projectIds: ['_Root', 'proj-1', 'proj-1-a', 'proj-2'],
            buildTypeIds: null
        };

        // target
        const target = filterVisible(tree, filter);

        // check
        expect(target).to.exist;
        expect(target).to.deep.equal({
            id: '_Root',
            name: '<Root>',
            vis: {
                visible: true,
                collapsed: false
            },
            buildTypes: [],
            childProjects: [{
                id: 'proj-1',
                name: 'proj-1',
                vis: {
                    visible: true,
                    collapsed: true
                },
                parentProjectId: '_Root',
                buildTypes: [{
                    id: 'build-1',
                    name: 'build-1'
                }],
                childProjects: [{
                    id: 'proj-1-a',
                    name: 'proj-1-a',
                    vis: {
                        visible: true,
                        collapsed: false
                    },
                    parentProjectId: '_Root',
                    buildTypes: [{
                        id: 'build-1-a',
                        name: 'build-1-a'
                    }],
                    childProjects: []
                }]
            }, {
                id: 'proj-2',
                name: 'proj-2',
                vis: {
                    visible: true,
                    collapsed: false
                },
                parentProjectId: '_Root',
                buildTypes: [{
                    id: 'build-2-a',
                    name: 'build-2-a'
                }, {
                    id: 'build-2-b',
                    name: 'build-2-b'
                }],
                childProjects: []
            }]
        });
    });

    it('should remove projects hidden by filter', () => {
        
        // setup
        const tree = {
            id: '_Root',
            name: '<Root>',
            vis: {
                visible: true,
                collapsed: false
            },
            buildTypes: [],
            childProjects: [{
                id: 'proj-1',
                name: 'proj-1',
                vis: {
                    visible: true,
                    collapsed: false
                },
                parentProjectId: '_Root',
                buildTypes: [{
                    id: 'build-1-a',
                    name: 'build-1-a'
                }],
                childProjects: []
            }, {
                id: 'proj-2',
                name: 'proj-2',
                vis: {
                    visible: true,
                    collapsed: false
                },
                parentProjectId: '_Root',
                buildTypes: [{
                    id: 'build-2-a',
                    name: 'build-2-a'
                }, {
                    id: 'build-2-b',
                    name: 'build-2-b'
                }],
                childProjects: []
            }]
        };

        const filter = {
            projectIds: ['proj-2'],
            buildTypeIds: null
        };

        // target
        const target = filterVisible(tree, filter);

        // check
        expect(target).to.exist;
        expect(target).to.deep.equal({
            id: '_Root',
            name: '<Root>',
            vis: {
                visible: true,
                collapsed: false
            },
            buildTypes: [],
            childProjects: [{
                id: 'proj-2',
                name: 'proj-2',
                vis: {
                    visible: true,
                    collapsed: false
                },
                parentProjectId: '_Root',
                buildTypes: [{
                    id: 'build-2-a',
                    name: 'build-2-a'
                }, {
                    id: 'build-2-b',
                    name: 'build-2-b'
                }],
                childProjects: []
            }]
        });
    });

    it('should remove all projects (except root) if filter is empty', () => {
        
        // setup
        const tree = {
            id: '_Root',
            name: '<Root>',
            vis: {
                visible: true,
                collapsed: false
            },
            buildTypes: [],
            childProjects: [{
                id: 'proj-1',
                name: 'proj-1',
                vis: {
                    visible: true,
                    collapsed: false
                },
                parentProjectId: '_Root',
                buildTypes: [{
                    id: 'build-1-a',
                    name: 'build-1-a'
                }],
                childProjects: []
            }, {
                id: 'proj-2',
                name: 'proj-2',
                vis: {
                    visible: true,
                    collapsed: false
                },
                parentProjectId: '_Root',
                buildTypes: [{
                    id: 'build-2-a',
                    name: 'build-2-a'
                }, {
                    id: 'build-2-b',
                    name: 'build-2-b'
                }],
                childProjects: []
            }]
        };

        const filter = {
            projectIds: [],
            buildTypeIds: null
        };

        // target
        const target = filterVisible(tree, filter);

        // check
        expect(target).to.exist;
        expect(target).to.deep.equal({
            id: '_Root',
            name: '<Root>',
            vis: {
                visible: true,
                collapsed: false
            },
            buildTypes: [],
            childProjects: []
        });
    });

    it('should not remove root proj hidden by own visibility config', () => {
        
        // setup
        const tree = {
            id: '_Root',
            name: '<Root>',
            vis: {
                visible: false,
                collapsed: false
            },
            buildTypes: [],
            childProjects: []
        };

        const filter = {
            projectIds: null,
            buildTypeIds: null
        };

        // target
        const target = filterVisible(tree, filter);

        // check
        expect(target).to.exist;
        expect(target).to.deep.equal({
            id: '_Root',
            name: '<Root>',
            vis: {
                visible: false,
                collapsed: false
            },
            buildTypes: [],
            childProjects: []
        });
    });

    it('should remove collapsed build types', () => {
        
        // setup
        const tree = {
            id: '_Root',
            name: '<Root>',
            vis: {
                visible: true,
                collapsed: false
            },
            buildTypes: [],
            childProjects: [{
                id: 'proj-1',
                name: 'proj-1',
                vis: {
                    visible: true,
                    collapsed: false
                },
                parentProjectId: '_Root',
                buildTypes: [{
                    id: 'build-1-a',
                    name: 'build-1-a'
                }],
                childProjects: []
            }, {
                id: 'proj-2',
                name: 'proj-2',
                vis: {
                    visible: true,
                    collapsed: true
                },
                parentProjectId: '_Root',
                buildTypes: [{
                    id: 'build-2-a',
                    name: 'build-2-a'
                }, {
                    id: 'build-2-b',
                    name: 'build-2-b'
                }],
                childProjects: []
            }]
        };

        const filter = {
            projectIds: null,
            buildTypeIds: null
        };

        // target
        const target = filterVisible(tree, filter);

        // check
        expect(target).to.exist;
        expect(target).to.deep.equal({
            id: '_Root',
            name: '<Root>',
            vis: {
                visible: true,
                collapsed: false
            },
            buildTypes: [],
            childProjects: [{
                id: 'proj-1',
                name: 'proj-1',
                vis: {
                    visible: true,
                    collapsed: false
                },
                parentProjectId: '_Root',
                buildTypes: [{
                    id: 'build-1-a',
                    name: 'build-1-a'
                }],
                childProjects: []
            }, {
                id: 'proj-2',
                name: 'proj-2',
                vis: {
                    visible: true,
                    collapsed: true
                },
                parentProjectId: '_Root',
                buildTypes: null,
                childProjects: null
            }]
        });
    });

    it('should not remove collapsed build types if filtering', () => {
        
        // setup
        const tree = {
            id: '_Root',
            name: '<Root>',
            vis: {
                visible: true,
                collapsed: false
            },
            buildTypes: [],
            childProjects: [{
                id: 'proj-1',
                name: 'proj-1',
                vis: {
                    visible: true,
                    collapsed: false
                },
                parentProjectId: '_Root',
                buildTypes: [{
                    id: 'build-1-a',
                    name: 'build-1-a'
                }],
                childProjects: []
            }, {
                id: 'proj-2',
                name: 'proj-2',
                vis: {
                    visible: true,
                    collapsed: true
                },
                parentProjectId: '_Root',
                buildTypes: [{
                    id: 'build-2-a',
                    name: 'build-2-a'
                }, {
                    id: 'build-2-b',
                    name: 'build-2-b'
                }],
                childProjects: []
            }]
        };

        const filter = {
            projectIds: null,
            buildTypeIds: ['build-1-a', 'build-2-a', 'build-2-b']
        };

        // target
        const target = filterVisible(tree, filter);

        // check
        expect(target).to.exist;
        expect(target).to.deep.equal({
            id: '_Root',
            name: '<Root>',
            vis: {
                visible: true,
                collapsed: false
            },
            buildTypes: [],
            childProjects: [{
                id: 'proj-1',
                name: 'proj-1',
                vis: {
                    visible: true,
                    collapsed: false
                },
                parentProjectId: '_Root',
                buildTypes: [{
                    id: 'build-1-a',
                    name: 'build-1-a'
                }],
                childProjects: []
            }, {
                id: 'proj-2',
                name: 'proj-2',
                vis: {
                    visible: true,
                    collapsed: true
                },
                parentProjectId: '_Root',
                buildTypes: [{
                    id: 'build-2-a',
                    name: 'build-2-a'
                }, {
                    id: 'build-2-b',
                    name: 'build-2-b'
                }],
                childProjects: []
            }]
        });
    });

    it('should remove build types hidden by filter', () => {
        
        // setup
        const tree = {
            id: '_Root',
            name: '<Root>',
            vis: {
                visible: true,
                collapsed: false
            },
            buildTypes: [],
            childProjects: [{
                id: 'proj-1',
                name: 'proj-1',
                vis: {
                    visible: true,
                    collapsed: false
                },
                parentProjectId: '_Root',
                buildTypes: [{
                    id: 'build-1-a',
                    name: 'build-1-a'
                }],
                childProjects: []
            }, {
                id: 'proj-2',
                name: 'proj-2',
                vis: {
                    visible: true,
                    collapsed: false
                },
                parentProjectId: '_Root',
                buildTypes: [{
                    id: 'build-2-a',
                    name: 'build-2-a'
                }, {
                    id: 'build-2-b',
                    name: 'build-2-b'
                }],
                childProjects: []
            }]
        };

        const filter = {
            projectIds: null,
            buildTypeIds: ['build-2-a']
        };

        // target
        const target = filterVisible(tree, filter);

        // check
        expect(target).to.exist;
        expect(target).to.deep.equal({
            id: '_Root',
            name: '<Root>',
            vis: {
                visible: true,
                collapsed: false
            },
            buildTypes: [],
            childProjects: [{
                id: 'proj-1',
                name: 'proj-1',
                vis: {
                    visible: true,
                    collapsed: false
                },
                parentProjectId: '_Root',
                buildTypes: [],
                childProjects: []
            }, {
                id: 'proj-2',
                name: 'proj-2',
                vis: {
                    visible: true,
                    collapsed: false
                },
                parentProjectId: '_Root',
                buildTypes: [{
                    id: 'build-2-a',
                    name: 'build-2-a'
                }],
                childProjects: []
            }]
        });
    });

    it('should remove all build types if filter is empty', () => {
        
        // setup
        const tree = {
            id: '_Root',
            name: '<Root>',
            vis: {
                visible: true,
                collapsed: false
            },
            buildTypes: [],
            childProjects: [{
                id: 'proj-1',
                name: 'proj-1',
                vis: {
                    visible: true,
                    collapsed: false
                },
                parentProjectId: '_Root',
                buildTypes: [{
                    id: 'build-1-a',
                    name: 'build-1-a'
                }],
                childProjects: []
            }, {
                id: 'proj-2',
                name: 'proj-2',
                vis: {
                    visible: true,
                    collapsed: false
                },
                parentProjectId: '_Root',
                buildTypes: [{
                    id: 'build-2-a',
                    name: 'build-2-a'
                }, {
                    id: 'build-2-b',
                    name: 'build-2-b'
                }],
                childProjects: []
            }]
        };

        const filter = {
            projectIds: null,
            buildTypeIds: []
        };

        // target
        const target = filterVisible(tree, filter);

        // check
        expect(target).to.exist;
        expect(target).to.deep.equal({
            id: '_Root',
            name: '<Root>',
            vis: {
                visible: true,
                collapsed: false
            },
            buildTypes: [],
            childProjects: [{
                id: 'proj-1',
                name: 'proj-1',
                vis: {
                    visible: true,
                    collapsed: false
                },
                parentProjectId: '_Root',
                buildTypes: [],
                childProjects: []
            }, {
                id: 'proj-2',
                name: 'proj-2',
                vis: {
                    visible: true,
                    collapsed: false
                },
                parentProjectId: '_Root',
                buildTypes: [],
                childProjects: []
            }]
        });
    });

    it('should remove all build types if in config mode', () => {

        // setup
        const tree = {
            id: '_Root',
            name: '<Root>',
            vis: {
                visible: true,
                collapsed: false
            },
            buildTypes: [],
            childProjects: [{
                id: 'proj-1',
                name: 'proj-1',
                vis: {
                    visible: true,
                    collapsed: false
                },
                parentProjectId: '_Root',
                buildTypes: [{
                    id: 'build-1-a',
                    name: 'build-1-a'
                }],
                childProjects: []
            }, {
                id: 'proj-2',
                name: 'proj-2',
                vis: {
                    visible: true,
                    collapsed: false
                },
                parentProjectId: '_Root',
                buildTypes: [{
                    id: 'build-2-a',
                    name: 'build-2-a'
                }, {
                    id: 'build-2-b',
                    name: 'build-2-b'
                }],
                childProjects: []
            }]
        };

        const filter = {
            projectIds: null,
            buildTypeIds: null
        };

        // target
        const target = filterVisible(tree, filter, true);

        // check
        expect(target).to.exist;
        expect(target).to.deep.equal({
            id: '_Root',
            name: '<Root>',
            vis: {
                visible: true,
                collapsed: false
            },
            buildTypes: [],
            childProjects: [{
                id: 'proj-1',
                name: 'proj-1',
                vis: {
                    visible: true,
                    collapsed: false
                },
                parentProjectId: '_Root',
                buildTypes: [],
                childProjects: []
            }, {
                id: 'proj-2',
                name: 'proj-2',
                vis: {
                    visible: true,
                    collapsed: false
                },
                parentProjectId: '_Root',
                buildTypes: [],
                childProjects: []
            }]
        });
    });

});