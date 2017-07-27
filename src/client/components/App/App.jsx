import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Header from '../Header';
import Footer from '../Footer';
import ProjectList from '../ProjectList';

import classes from './App.css';

/**
 * Root component
 */
export default class App extends Component {

    static propTypes = {
        onComponentDidMount: PropTypes.func.isRequired,
        rootProject: PropTypes.object
    }

    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        return (
            <div className={classes.root}>
                <Header />

                <main className={classes.main}>
                    <ProjectList />
                </main>
                
                <Footer />
            </div>
        );
    }
}