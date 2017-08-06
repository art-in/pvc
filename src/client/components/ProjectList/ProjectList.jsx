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

        return (
            <div className={classes.root}>
                <div className={classes['header']}>
                    <span className={classes['colexp-btn']}
                        onClick={onCollapseAll}>
                        collapse all
                    </span>
                    &nbsp; / &nbsp;
                    <span className={classes['colexp-btn']}
                        onClick={onExpandAll}>
                        expand all
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

                {rootProject ?
                    <Project projectId={'_Root'} />
                    :
                    <Waiter />
                }
            </div>
        );
    }

}