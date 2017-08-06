import React, {Component} from 'react';
import PropTypes from 'prop-types';
import debounce from 'debounce';

import Waiter from '../Waiter';

export default class SearchBox extends Component {

    static propTypes = {
        onChange: PropTypes.func.isRequired,
        isSearching: PropTypes.bool.isRequired
    }

    onKeyDown = event => {
        event.persist();
        this.onKeyDownDebounced(event);
    };

    onKeyDownDebounced = debounce(event => {
        this.props.onChange(event.target.value);
    }, 500);

    render() {
        return (
            <span>
                <input type='text' onChange={this.onKeyDown} />
                {this.props.isSearching && <Waiter />}
            </span>
        );
    }
}