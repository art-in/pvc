import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Project from '../Project';
import Waiter from '../Waiter';
import SearchBox from '../SearchBox';

import classes from './ProjectList.css';

export default class ProjectList extends Component {

    static propTypes = {
        rootProject: PropTypes.object,
        isConfiguring: PropTypes.bool.isRequired,
        isSearching: PropTypes.bool.isRequired,
        onStartConfiguration: PropTypes.func.isRequired,
        onStopConfiguration: PropTypes.func.isRequired,
        onCollapseAll: PropTypes.func.isRequired,
        onExpandAll: PropTypes.func.isRequired,
        onSearch: PropTypes.func.isRequired
    }

    render() {
        const {rootProject, isConfiguring, isSearching} = this.props;
        const {onStartConfiguration, onStopConfiguration} = this.props;
        const {onCollapseAll, onExpandAll, onSearch} = this.props;

        const rootLoaded = Boolean(rootProject);

        const hasProjects = rootLoaded &&
            rootProject.childProjects &&
            rootProject.childProjects.length > 0;

        return (
            <div className={classes.root}>
                <div className={classes['header']}>
                    <span className={classes['collapse-all']}
                        onClick={onCollapseAll}>
                    </span>
                    <span className={classes['expand-all']}
                        onClick={onExpandAll}>
                    </span>

                    <SearchBox onChange={onSearch} isSearching={isSearching} />
                    
                    <span className={classes['config-btn']}
                        onClick={isConfiguring ?
                            onStopConfiguration :
                            onStartConfiguration}>
                        {isConfiguring ?
                            'Cancel Configuring Visible Projects' :
                            'Configure Visible Projects'}
                    </span>
                </div>

                {rootLoaded &&
                    <Project projectId={rootProject.id}
                        collapsable={false}
                        movable={false} />}

                {rootLoaded && !hasProjects &&
                    <span className={classes['no-projects']}>
                        There are no projects to show.
                        Please clean search box or configure visible projects.
                    </span>}

                {!rootLoaded && <Waiter />}
                
            </div>
        );
    }

}