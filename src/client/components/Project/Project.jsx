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
        
        isConfiguring: PropTypes.bool.isRequired,

        onExpand: PropTypes.func.isRequired,
        onCollapse: PropTypes.func.isRequired,

        onShow: PropTypes.func.isRequired,
        onHide: PropTypes.func.isRequired,

        onMoveUp: PropTypes.func.isRequired,
        onMoveDown: PropTypes.func.isRequired,

        onMove: PropTypes.func.isRequired,
        DragHandle: PropTypes.func
    }

    shouldComponentUpdate(nextProps) {
        const project = this.props.project;
        const nextProject = nextProps.project;

        const childProjects = project.childProjects || [];
        const nextChildProjects = nextProject.childProjects || [];

        return this.props.isConfiguring !== nextProps.isConfiguring ||
            project.id !== nextProject.id ||
            project.vis.collapsed !== nextProject.vis.collapsed ||
            project.vis.visible !== nextProject.vis.visible ||
            project.childrenLoading !== nextProject.childrenLoading ||
            childProjects.some((p, idx) => p.id !==
                (nextChildProjects[idx] !== undefined &&
                 nextChildProjects[idx].id));
    }

    render() {
        const {id, name, childProjects, buildTypes} = this.props.project;
        const {childrenLoading} = this.props.project;
        const {collapsed, visible} = this.props.project.vis;
        const {isConfiguring, onExpand, onCollapse} = this.props;
        const {onShow, onHide} = this.props;
        const {onMoveUp, onMoveDown, onMove, DragHandle} = this.props;
        
        if (!isConfiguring && !visible) {
            // project configured to be hidden
            return null;
        }

        const buildTypesLoaded = Boolean(buildTypes && buildTypes.length);
        
        // do not show builds when configuring projects visibility
        const buildTypesShowable = Boolean(!isConfiguring && buildTypesLoaded);
        const childProjectsShowable = Boolean(
            childProjects && childProjects.length);
        
        const childrenShowable = buildTypesShowable || childProjectsShowable;
        const showChild = !collapsed && (childrenLoading || childrenShowable);

        return (
            <div className={cx(classes.root, {[classes.hidden]: !visible})}>

                <ProjectHeader
                    name={name}
                    visible={visible}
                    isConfiguring={isConfiguring}
                    collapsed={collapsed}
                    DragHandle={DragHandle}
                    onExpand={onExpand.bind(null, id)}
                    onCollapse={onCollapse.bind(null, id)}
                    onShow={onShow.bind(null, id)}
                    onHide={onHide.bind(null, id)}
                    onMoveUp={onMoveUp.bind(null, id)}
                    onMoveDown={onMoveDown.bind(null, id)} />

                {showChild &&
                    <div className={classes.child}>
                        
                        {buildTypesShowable &&
                            <div className={classes['build-types']}>
                                {buildTypes.map(b =>
                                    <BuildType key={b.id} build={b} />)}
                            </div>}

                        {childProjectsShowable &&
                            <ProjectChildren
                                sortable={isConfiguring}
                                helperClass={classes['drag-ghost']}
                                lockToContainerEdges={true}
                                lockAxis={'y'}
                                useDragHandle={true}
                                onSortEnd={onMove.bind(null, id)}
                                className={classes['child-projects']}
                                projectIds={childProjects.map(p => p.id)} />}

                        {childrenLoading &&
                            <Waiter className={classes['child-projects']} />}
                    </div>
                }
            </div>
        );
    }
}