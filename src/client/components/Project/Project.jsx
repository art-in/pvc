import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import ProjectHeader from '../ProjectHeader';
import ProjectChildren from '../ProjectChildren';

import BuildType from '../BuildType';
import Waiter from '../Waiter';

import classes from './Project.css';

export default class Project extends Component {
    
    static propTypes = {
        project: PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            childrenLoading: PropTypes.bool,
            childProjects: PropTypes.arrayOf(PropTypes.object),
            buildTypes: PropTypes.arrayOf(PropTypes.shape({
                id: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired
            })),
            
            vis: PropTypes.shape({
                collapsed: PropTypes.bool.isRequired,
                visible: PropTypes.bool.isRequired
            }).isRequired
        }).isRequired,
        
        collapsable: PropTypes.bool,
        movable: PropTypes.bool,

        isConfiguring: PropTypes.bool.isRequired,
        isFiltering: PropTypes.bool.isRequired,
        searchStr: PropTypes.string,

        onExpand: PropTypes.func.isRequired,
        onCollapse: PropTypes.func.isRequired,

        onShow: PropTypes.func.isRequired,
        onHide: PropTypes.func.isRequired,

        onMoveUp: PropTypes.func.isRequired,
        onMoveDown: PropTypes.func.isRequired,

        onMove: PropTypes.func.isRequired,
        useDragAndDrop: PropTypes.bool.isRequired,
        DragHandle: PropTypes.func
    }

    static defaultProps = {
        collapsable: true,
        movable: true
    };

    shouldComponentUpdate(nextProps) {
        const project = this.props.project;
        const nextProject = nextProps.project;

        const childProjects = project.childProjects || [];
        const nextChildProjects = nextProject.childProjects || [];

        return this.props.isConfiguring !== nextProps.isConfiguring ||
            this.props.isFiltering !== nextProps.isFiltering ||
            this.props.searchStr !== nextProps.searchStr ||
            project.id !== nextProject.id ||
            project.vis.collapsed !== nextProject.vis.collapsed ||
            project.vis.visible !== nextProject.vis.visible ||
            project.childrenLoading !== nextProject.childrenLoading ||
            childProjects.length !== nextChildProjects.length ||
            childProjects.some((p, idx) => p.id !==
                (nextChildProjects[idx] !== undefined &&
                 nextChildProjects[idx].id));
    }

    render() {
        const {id, name, childProjects, buildTypes} = this.props.project;
        const {childrenLoading} = this.props.project;
        const {collapsed, visible} = this.props.project.vis;
        const {isConfiguring, onExpand, onCollapse} = this.props;
        const {onShow, onHide, isFiltering, searchStr} = this.props;
        const {onMoveUp, onMoveDown, onMove} = this.props;
        const {DragHandle, useDragAndDrop, collapsable, movable} = this.props;
        
        const buildTypesLoaded = Boolean(buildTypes && buildTypes.length);
        const childProjectsLoaded = Boolean(
            childProjects && childProjects.length);
        
        const childrenLoaded = buildTypesLoaded || childProjectsLoaded;
        const showChild = (!collapsable || !collapsed || isFiltering) &&
            (childrenLoading || childrenLoaded);
            
        return (
            <div className={cx(classes.root,
                {[classes.hidden]: isConfiguring && !visible})}>

                <ProjectHeader
                    name={name}
                    visible={visible}
                    collapsable={collapsable}
                    movable={movable}
                    isConfiguring={isConfiguring}
                    collapsed={collapsed}
                    searchStr={searchStr}
                    DragHandle={DragHandle}
                    useDragAndDrop={useDragAndDrop}
                    onExpand={onExpand.bind(null, id)}
                    onCollapse={onCollapse.bind(null, id)}
                    onShow={onShow.bind(null, id)}
                    onHide={onHide.bind(null, id)}
                    onMoveUp={onMoveUp.bind(null, id)}
                    onMoveDown={onMoveDown.bind(null, id)} />

                {showChild &&
                    <div className={classes.child}>
                        
                        {buildTypesLoaded &&
                            <div className={classes['build-types']}>
                                {buildTypes.map(b =>
                                    <BuildType key={b.id} build={b}
                                        searchStr={searchStr} />)}
                            </div>}

                        {childProjectsLoaded &&
                            <ProjectChildren
                                className={classes['child-projects']}
                                sortable={isConfiguring}
                                helperClass={classes['drag-ghost']}
                                lockToContainerEdges={true}
                                lockAxis={'y'}
                                useDragHandle={true}
                                onSortEnd={onMove.bind(null, id)}
                                projectIds={childProjects.map(p => p.id)} />}

                        {childrenLoading &&
                            <Waiter className={cx(
                                classes['child-projects'],
                                classes.waiter)} />}
                    </div>
                }
            </div>
        );
    }
}