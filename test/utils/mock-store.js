import extend from 'extend';
import configureStore from 'redux-mock-store';
const mocker = configureStore();

import initialState from 'src/client/state/initial-state';

/**
 * Creates mock store
 * @param {object} statePatch - fragment of state to patch upon initial state
 * @return {object} mocked store
 */
export default function mockStore(statePatch) {
    return mocker(extend({}, initialState, statePatch));
}