import React, {Component} from 'react';
import PropTypes from 'prop-types';

import classes from './BuildType.css';

export default class BuildType extends Component {
    
    static propTypes = {
        build: PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired
        }).isRequired
    }

    render() {
        const {build} = this.props;

        return (
            <div className={classes.root}>
                BUILD: {build.name}
            </div>
        );
    }
}