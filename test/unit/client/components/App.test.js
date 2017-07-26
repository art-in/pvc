import React from 'react';
import {mount} from 'enzyme';
import {expect} from 'chai';
import sinon from 'sinon';

import App from 'src/client/components/App/App.jsx';

describe('App', () => {

    it('should be rendered', () => {
        const wrapper = mount(
            <App projects={[]} onComponentDidMount={() => {}} />
        );
        
        expect(wrapper.text()).to.equal('Total number of projects: 0');
    });

    it('should render correct number of projects', () => {
        const wrapper = mount(
            <App projects={[{}, {}]} onComponentDidMount={() => {}} />
        );
        
        expect(wrapper.text()).to.equal('Total number of projects: 2');
    });

    it('should call onComponentDidMount', () => {
        const spy = sinon.spy();

        mount(
            <App projects={[]} onComponentDidMount={spy} />
        );
        
        expect(spy.callCount).to.equal(1);
    });

});