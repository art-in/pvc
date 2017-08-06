import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import escapeRegexp from 'escape-string-regexp';

import classes from './Marker.css';

/**
 * Renders string and wraps passed sub-string into highlighted span
 */
export default class Marker extends Component {

    static propTypes = {
        className: PropTypes.string,
        str: PropTypes.string,
        markStr: PropTypes.string
    }

    render() {
        const {className, str, markStr} = this.props;

        if (!str) {
            return null;
        }

        if (str === markStr) {
            return (
                <span className={cx(className, classes.highlight)}>
                    {str}
                </span>
            );
        }

        let parts = [];

        const markRegexp = RegExp(escapeRegexp(markStr || ''), 'gi');
        if (markStr && markRegexp.test(str)) {
            const rawParts = str.split(markRegexp);
            const markParts = str.match(markRegexp);
            parts = rawParts.reduce((accum, p, idx) => {
                accum.push(p);
                const markPart = markParts.shift();
                accum.push(
                    <span key={idx}
                        className={classes.highlight}>
                        {markPart}
                    </span>);
                return accum;
            }, parts);
            parts.pop();
        } else {
            parts.push(str);
        }

        return (
            <span className={className}>
                {parts}
            </span>
        );
    }
}