import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Project from '../Project';
import Waiter from '../Waiter';

import classes from './ProjectList.css';

export default class ProjectList extends Component {

    static propTypes = {
        rootProject: PropTypes.object,
        isConfiguring: PropTypes.bool.isRequired,
        onStartConfiguration: PropTypes.func.isRequired,
        onStopConfiguration: PropTypes.func.isRequired
    }

    render() {
        const {rootProject, isConfiguring} = this.props;
        const {onStartConfiguration, onStopConfiguration} = this.props;

        return (
            <div className={classes.root}>
                <div className={classes['header']}>
                    {isConfiguring ?
                        <span className={classes['config-btn']}
                            onClick={onStopConfiguration}>
                            {'Cancel Configuring Visible Projects'}
                        </span>
                        :
                        <span className={classes['config-btn']}
                            onClick={onStartConfiguration}>
                            {'Configure Visible Projects'}
                        </span>
                    }
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