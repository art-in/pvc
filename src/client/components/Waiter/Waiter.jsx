import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import classes from './Waiter.css';

export default class Waiter extends Component {
    
    static propTypes = {
        className: PropTypes.string
    }

    render() {
        const {className} = this.props;
        return (
            <span className={cx(classes.root, className)}>
                loading ...
            </span>
        );
    }
}