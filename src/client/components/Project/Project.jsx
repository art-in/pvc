import React, {Component} from 'react';
import PropTypes from 'prop-types';

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
            
            collapsed: PropTypes.bool // TODO: .isRequired
        }).isRequired,
        
        onExpanding: PropTypes.func.isRequired,
        onCollapsing: PropTypes.func.isRequired
    }

    shouldComponentUpdate(nextProps) {
        return this.props.project.id !== nextProps.project.id ||
            this.props.project.collapsed !== nextProps.project.collapsed;
    }

    render() {
        const {id, childProjects, buildTypes, collapsed} = this.props.project;
        
        let child;
        let build;

        if (childProjects.length) {
            child = (
                <div className={classes['child-projects']}>
                    {childProjects.map(p =>
                        <ConnectedProject key={p.id} projectId={p.id} />)}
                </div>
            );
        }

        if (buildTypes.length) {
            build = (
                <div className={classes['build-types']}>
                    {buildTypes.map(b =>
                        <BuildType key={b.id} build={b} />)}
                </div>
            );
        }

        return (
            <div className={classes.root}>
                <div className={classes.header}>
                    {collapsed ?
                        <span className={classes['header-collapse']}
                            onClick={this.props.onExpanding.bind(null, id)}>
                            {'expand'}
                        </span> :
                        <span className={classes['header-expand']}
                            onClick={this.props.onCollapsing.bind(null, id)}>
                            {'collapse'}
                        </span>
                    }
                    <span className={classes['header-name']}>
                        {this.props.project.name}
                    </span>
                </div>

                {!collapsed && (build || child) &&
                    <div className={classes.child}>
                        {build}
                        {child}
                    </div>
                }
            </div>
        );
    }
}