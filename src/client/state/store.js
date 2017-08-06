/* global process */

import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';
import rootReducer from './root-reducer';

/**
 * State store.
 */
const middlewares = [];

middlewares.push(thunk);

// do not log in production
if (process.env.NODE_ENV !== 'production') {
    middlewares.push(createLogger({
        collapsed: true,
        timestamp: false
    }));
}

const store = createStore(rootReducer, applyMiddleware(...middlewares));

if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    // https://github.com/reactjs/react-redux/releases/tag/v2.0.0
    module.hot.accept('./root-reducer', () => {
        // eslint-disable-next-line no-undef
        const nextRootReducer = require('./root-reducer').default;
        store.replaceReducer(nextRootReducer);
    });
}

export default store;