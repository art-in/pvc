import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classes from './App.css';

/**
 * Root component
 */
export default class App extends Component {

    static propTypes = {
        projects: PropTypes.array.isRequired,
        onComponentDidMount: PropTypes.func.isRequired
    }

    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        return (
            <main className={classes.root}>
                Total number of projects: {this.props.projects.length}
            </main>
        );
    }
}