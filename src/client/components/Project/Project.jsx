import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import ConnectedProject from './Project.connect';
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
        onHide: PropTypes.func.isRequired
    }

    shouldComponentUpdate(nextProps) {
        const project = this.props.project;
        const nextProject = nextProps.project;

        return project.id !== nextProject.id ||
            project.vis.collapsed !== nextProject.vis.collapsed ||
            project.vis.visible !== nextProject.vis.visible ||
            this.props.isConfiguring !== nextProps.isConfiguring;
    }

    render() {
        const {id, childProjects, buildTypes} = this.props.project;
        const {collapsed, visible} = this.props.project.vis;
        const {isConfiguring, onExpand, onCollapse} = this.props;
        const {onShow, onHide} = this.props;
        
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
                <div className={classes['child-projects']}>
                    {childProjects.map(p =>
                        <ConnectedProject key={p.id} projectId={p.id} />)}
                </div>
            );
        }

        // build types
        if (buildTypes.length) {
            build = (
                <div className={classes['build-types']}>
                    {buildTypes.map(b =>
                        <BuildType key={b.id} build={b} />)}
                </div>
            );
        }

        // visibility configuration
        if (isConfiguring) {
            config = (
                <span className={classes.config}>
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