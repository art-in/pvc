import extend from 'extend';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import rootReduser from 'src/client/state/root-reducer';

import initialState from 'src/client/state/initial-state';

/**
 * Creates store (real, not mock)
 * @param {object} statePatch - fragment of state to patch upon initial state
 * @return {object} store
 */
export default function createStoreForTest(statePatch) {
    return createStore(
        rootReduser,
        extend({}, initialState, statePatch),
        applyMiddleware(thunk));
}