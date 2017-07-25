import {AppContainer} from 'react-hot-loader';
import {Provider} from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import store from './state/store';

/**
 * Renders root component
 * @param {Component} App
 * @return {function}
 */
const render = App =>
    // eslint-disable-next-line react/no-render-return-value
    ReactDOM.render(
        <AppContainer>
            <Provider store={store}>
                <App />
            </Provider>
        </AppContainer>,
        document.querySelector('#root')
    );

render(App);
if (module.hot) {
    module.hot.accept(App, () => render(App));
}