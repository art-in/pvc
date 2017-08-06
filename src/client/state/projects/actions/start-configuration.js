import types from './types';

/**
 * Starts visibility configuration mode
 * @return {function}
 */
export default () => async dispatch => {
    dispatch({
        type: types.START_VISIBILITY_CONFIGURATION
    });
};