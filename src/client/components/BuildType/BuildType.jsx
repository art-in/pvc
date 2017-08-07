import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Marker from '../Marker';

import classes from './BuildType.css';

export default class BuildType extends Component {
    
    static propTypes = {
        className: PropTypes.string,
        build: PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired
        }).isRequired,
        searchStr: PropTypes.string
    }

    render() {
        const {className, build, searchStr} = this.props;

        return (
            <div className={cx(className, classes.root)}>
                <span className={classes.icon} />
                <Marker className={classes.name}
                    str={build.name} markStr={searchStr} />
            </div>
        );
    }
}