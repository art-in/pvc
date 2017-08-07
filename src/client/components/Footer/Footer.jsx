import React, {Component} from 'react';
import packageConfig from '../../../../package.json';

import classes from './Footer.css';

export default class Footer extends Component {

    static githubUrl = 'https://github.com/artin-phares/pvc'

    render() {
        return (
            <footer className={classes.root}>
                <div className={classes.container}>
                    pvc v{packageConfig.version.slice(0, -2)}
                    &nbsp;&nbsp;
                    <a className={classes.github}
                        target={'_blank'} href={Footer.githubUrl}></a>
                </div>
            </footer>
        );
    }

}