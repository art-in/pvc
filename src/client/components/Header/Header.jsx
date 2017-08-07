import React, {Component} from 'react';

import classes from './Header.css';

export default class Header extends Component {

    render() {
        return (
            <header className={classes.root}>
                <div className={classes.container}>
                    <span className={classes.logo} />
                    <span className={classes.projects}>
                        Projects
                    </span>
                </div>
            </header>
        );
    }

}