import React from 'react';
import {mount} from 'enzyme';
import {expect} from 'chai';
import configureStore from 'redux-mock-store';
import {Provider} from 'react-redux';
import sinon from 'sinon';
import initialState from 'src/client/state/initial-state';

import App from 'src/client/components/App/App.jsx';

const mockStore = configureStore();
const storeWithInitialState = mockStore(initialState);

describe('App', () => {

    it('should be rendered', () => {

        const wrapper = mount(
            <Provider store={storeWithInitialState}>
                <App projects={[]} onComponentDidMount={() => {}} />
            </Provider>
        );
        
        expect(wrapper).to.exist;
    });

    it('should call onComponentDidMount', () => {
        const spy = sinon.spy();

        mount(
            <Provider store={storeWithInitialState}>
                <App projects={[]} onComponentDidMount={spy} />
            </Provider>
        );
        
        expect(spy.callCount).to.equal(1);
    });

});