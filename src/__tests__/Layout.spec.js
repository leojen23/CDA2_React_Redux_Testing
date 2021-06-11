import React from 'react'
import { shallow, mount } from 'enzyme';

import Layout from '../components/Layout';

import '../setUpTests';

jest.mock("../components/home", () => {
    return "home-component";
})
describe('Layout snapshot',()=>{
    it('It renders without crashing', () => {
        let wrapper = shallow(<Layout />);
        expect(wrapper);
    });
    it('rendercorrectly', ()=> {
        let wrapper = shallow(<Layout />);
        expect(wrapper).toMatchSnapshot();
    })

    it('It renders Home', () => {
        const wrapper = mount(<Layout />);
        let home = wrapper.find('home-component');
        expect(home.props.fetchRandomNumber)
    });
});
