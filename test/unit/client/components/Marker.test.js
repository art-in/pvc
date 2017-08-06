import React from 'react';
import {mount} from 'enzyme';
import {expect} from 'chai';
import removeReactText from 'test/utils/remove-react-text';

import Marker from 'src/client/components/Marker';

describe('Marker', () => {

    it('should be rendered', () => {

        const wrapper = mount(
            <Marker str={'12345'} />
        );
        
        expect(wrapper).to.exist;
        expect(wrapper.text()).to.equal('12345');
    });

    it('should not render if string is empty', () => {
        
        const wrapper = mount(
            <Marker />
        );
        
        expect(wrapper).to.exist;
        expect(wrapper.html()).to.equal(null);
    });

    it('should wrap string into span', () => {

        const wrapper = mount(
            <Marker str={'12345'} />
        );
        
        expect(wrapper).to.exist;
        const html = removeReactText(wrapper.html());

        expect(html).to.equal('<span>12345</span>');
    });

    it('should wrap sub-string into mark span', () => {

        const wrapper = mount(
            <Marker str={'12345'} markStr={'234'} />
        );
        
        expect(wrapper).to.exist;
        const html = removeReactText(wrapper.html());

        expect(html).to.equal(
            '<span>1<span class="Marker-highlight">234</span>5</span>');
    });

    it('should wrap sub-string into mark span on left edge', () => {

        const wrapper = mount(
            <Marker str={'12345'} markStr={'123'} />
        );
        
        expect(wrapper).to.exist;
        const html = removeReactText(wrapper.html());

        expect(html).to.equal(
            '<span><span class="Marker-highlight">123</span>45</span>');
    });

    it('should wrap sub-string into mark span on right edge', () => {

        const wrapper = mount(
            <Marker str={'12345'} markStr={'345'} />
        );
        
        expect(wrapper).to.exist;
        const html = removeReactText(wrapper.html());

        expect(html).to.equal(
            '<span>12<span class="Marker-highlight">345</span></span>');
    });

    it('should wrap multiple sub-strings into mark spans', () => {

        const wrapper = mount(
            <Marker str={'12!3!45'} markStr={'!'} />
        );
        
        expect(wrapper).to.exist;
        const html = removeReactText(wrapper.html());

        expect(html).to.equal(
            '<span>' +
            '12' +
            '<span class="Marker-highlight">!</span>' +
            '3' +
            '<span class="Marker-highlight">!</span>' +
            '45' +
            '</span>');
    });

    it('should not render mark spans if sub-string not found', () => {
        
        const wrapper = mount(
            <Marker str={'12345'} markStr={'unknown'} />
        );
        
        expect(wrapper).to.exist;
        const html = removeReactText(wrapper.html());

        expect(html).to.equal(
            '<span>12345</span>');
    });

    it('should wrap entire string into mark span on equality', () => {
        
        const wrapper = mount(
            <Marker str={'12345'} markStr={'12345'} />
        );
        
        expect(wrapper).to.exist;
        const html = removeReactText(wrapper.html());

        expect(html).to.equal(
            '<span class="Marker-highlight">12345</span>');
    });

    it('should be case insensitive', () => {
        
        const wrapper = mount(
            <Marker str={'case-CASE-CaSe'} markStr={'case'} />
        );
        
        expect(wrapper).to.exist;
        const html = removeReactText(wrapper.html());

        expect(html).to.equal(
            '<span>' +
            '<span class="Marker-highlight">case</span>' +
            '-' +
            '<span class="Marker-highlight">CASE</span>' +
            '-' +
            '<span class="Marker-highlight">CaSe</span>' +
            '</span>');
    });

    it('should mark special chars', () => {
        
        const wrapper = mount(
            <Marker str={'-%/?-'} markStr={'%/?'} />
        );
        
        expect(wrapper).to.exist;
        const html = removeReactText(wrapper.html());

        expect(html).to.equal(
            '<span>' +
            '-' +
            '<span class="Marker-highlight">%/?</span>' +
            '-' +
            '</span>');
    });
});