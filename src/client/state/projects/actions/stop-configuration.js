import types from './types';

/**
 * Stops visibility configuration mode
 * @return {function}
 */
export default () => async dispatch => {
    dispatch({
        type: types.STOP_VISIBILITY_CONFIGURATION
    });
};