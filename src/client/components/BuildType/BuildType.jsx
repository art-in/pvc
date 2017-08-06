import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Marker from '../Marker';

import classes from './BuildType.css';

export default class BuildType extends Component {
    
    static propTypes = {
        build: PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired
        }).isRequired,
        searchStr: PropTypes.string
    }

    render() {
        const {build, searchStr} = this.props;

        return (
            <div className={classes.root}>
                BUILD: <Marker str={build.name} markStr={searchStr} />
            </div>
        );
    }
}