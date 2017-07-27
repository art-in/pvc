import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import rootReduser from 'src/client/state/root-reducer';

/**
 * Creates store (real, not mock)
 * @param {object} state
 * @return {object} store
 */
export default function createStoreMock(state) {
    return createStore(rootReduser, state, applyMiddleware(thunk));
}