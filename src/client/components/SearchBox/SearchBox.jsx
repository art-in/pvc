import React, {Component} from 'react';
import PropTypes from 'prop-types';
import debounce from 'debounce';

import Waiter from '../Waiter';

import classes from './SearchBox.css';

export default class SearchBox extends Component {

    state = {
        val: ''
    }

    static propTypes = {
        onChange: PropTypes.func.isRequired,
        isSearching: PropTypes.bool.isRequired
    }

    onKeyDown = debounce(() => {
        const val = this.input.value;
        this.props.onChange(val);
        this.setState({val});
    }, 500);

    onClean = () => {
        this.input.value = '';
        this.onKeyDown();
    }

    render() {
        return (
            <span className={classes.root}>
                <span className={classes['input-container']}>

                    <input type='text' onChange={this.onKeyDown}
                        ref={input => this.input = input}
                        placeholder={'search projects'} />
                    
                    {this.state.val &&
                        <div className={classes.clean}
                            onClick={this.onClean}
                            title={'Clean'} />}
                </span>
                
                {this.props.isSearching && <Waiter />}
            </span>
        );
    }
}