import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

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
        const {id, childProjects, buildTypes} = this.props.project;
        const {collapsed, visible} = this.props.project.vis;
        const {isConfiguring, onExpand, onCollapse} = this.props;
        const {onShow, onHide} = this.props;
        const {onMoveUp, onMoveDown, onMove, DragHandle} = this.props;
        
        if (!isConfiguring && !visible) {
            // project configured to be hidden
            return null;
        }
        
        let childProj;
        let build;
        let config;

        // child projects
        if (childProjects.length) {
            childProj = (
                <ProjectChildren
                    sortable={isConfiguring}
                    helperClass={classes['drag-ghost']}
                    lockToContainerEdges={true}
                    lockAxis={'y'}
                    useDragHandle={true}
                    onSortEnd={onMove.bind(null, id)}
                    className={classes['child-projects']}
                    projectIds={childProjects.map(p => p.id)} />
            );
        }

        // build types
        // do not show builds when configuring projects visibility
        if (!isConfiguring && buildTypes.length) {
            build = (
                <div className={classes['build-types']}>
                    {buildTypes.map(b =>
                        <BuildType key={b.id} build={b} />)}
                </div>
            );
        }

        // visibility configuration
        // TODO: show drag-handle in modern browsers,
        //       up/down buttons - in old ones (#1)
        if (isConfiguring) {
            config = (
                <span className={classes.config}>

                    {DragHandle && <DragHandle />}

                    <span className={classes.up}
                        onClick={onMoveUp.bind(null, id)}>
                        {'up'}
                    </span>
                    <span className={classes.down}
                        onClick={onMoveDown.bind(null, id)}>
                        {'down'}
                    </span>

                    <span className={cx({
                        [classes.hide]: visible,
                        [classes.show]: !visible})}
                    onClick={visible ?
                        onHide.bind(null, id) :
                        onShow.bind(null, id)}>
                        {visible ? 'hide' : 'show'}
                    </span>
                </span>
            );
        }

        // header
        const header = (
            <div className={classes.header}>
                <span className={cx({
                    [classes.collapse]: !collapsed,
                    [classes.expand]: collapsed})}
                onClick={collapsed ?
                    onExpand.bind(null, id) :
                    onCollapse.bind(null, id)}>
                    {collapsed ? 'expand' : 'collapse'}
                </span>

                <span className={classes.name}>
                    {this.props.project.name}
                </span>

                {isConfiguring && config}
            </div>
        );

        return (
            <div className={cx(classes.root, {[classes.hidden]: !visible})}>
                {header}

                {!collapsed && (build || childProj) &&
                    <div className={classes.child}>
                        {build}
                        {childProj}
                    </div>
                }
            </div>
        );
    }
}