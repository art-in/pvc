import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import ProjectHeader from '../ProjectHeader';
import ProjectChildren from '../ProjectChildren';

import BuildType from '../BuildType';

import classes from './Project.css';

export default class Project extends Component {
    
    static propTypes = {
        project: PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            childProjects: PropTypes.arrayOf(PropTypes.object).isRequired,
            buildTypes: PropTypes.arrayOf(PropTypes.shape({
                id: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired
            })).isRequired,
            
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
        
        return this.props.isConfiguring !== nextProps.isConfiguring ||
            project.id !== nextProject.id ||
            project.vis.collapsed !== nextProject.vis.collapsed ||
            project.vis.visible !== nextProject.vis.visible ||
            project.childProjects.some((p, idx) => p.id !==
                (nextProject.childProjects[idx] !== undefined &&
                 nextProject.childProjects[idx].id));
    }

    render() {
        const {id, name, childProjects, buildTypes} = this.props.project;
        const {collapsed, visible} = this.props.project.vis;
        const {isConfiguring, onExpand, onCollapse} = this.props;
        const {onShow, onHide} = this.props;
        const {onMoveUp, onMoveDown, onMove, DragHandle} = this.props;
        
        if (!isConfiguring && !visible) {
            // project configured to be hidden
            return null;
        }

        // do not show builds when configuring projects visibility
        const showBuildTypes = Boolean(!isConfiguring && buildTypes.length);
        const showChildProjects = Boolean(childProjects.length);

        const showChild = !collapsed && (showBuildTypes || showChildProjects);

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
                        
                        {showBuildTypes &&
                            <div className={classes['build-types']}>
                                {buildTypes.map(b =>
                                    <BuildType key={b.id} build={b} />)}
                            </div>}

                        {showChildProjects &&
                            <ProjectChildren
                                sortable={isConfiguring}
                                helperClass={classes['drag-ghost']}
                                lockToContainerEdges={true}
                                lockAxis={'y'}
                                useDragHandle={true}
                                onSortEnd={onMove.bind(null, id)}
                                className={classes['child-projects']}
                                projectIds={childProjects.map(p => p.id)} />}
                    </div>
                }
            </div>
        );
    }
}