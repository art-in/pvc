import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Project from '../Project';
import Waiter from '../Waiter';

import classes from './ProjectList.css';

export default class ProjectList extends Component {

    static propTypes = {
        rootProject: PropTypes.object
    }

    render() {
        return (
            <div className={classes.root}>
                {this.props.rootProject ?
                    <Project projectId={'_Root'} />
                    :
                    <Waiter />
                }
            </div>
        );
    }

}