import React from 'react'
import { shallow, mount, render} from 'enzyme';
import renderer from 'react-test-renderer';

import HomeContainer,{Home} from '../components/Home';

import {Provider} from 'react-redux';
import '../setUpTests';

import {addInputs, subtractInputs} from '../actions/calculatorActions'
import {createStore} from 'redux'
import calculatorReducers from '../reducers/calculatorReducers'

describe('HOME snapshot',()=>{
    it('It renders without crashing', () => {
        const wrapper = renderer
        .create(<Home />)
        .toJSON();
    expect(wrapper).toMatchSnapshot();
    });

});

describe('HOME shallow description',()=>{
    let wrapper;
    const output = 10;

    //Permet avant chaque it de refaire un fresh shallow rendering
    // afin d'éviter les conflits avec les tests précédents
    beforeEach(()=>{
        wrapper = shallow(<Home output={output}/>)
    });

    it('Renders', () => {
       expect(wrapper.length).toEqual(1)
    });

    it('Contains header - h2', () => {
        expect(wrapper.find('h2').length).toEqual(1);
    });
    it('H2 header value ', () => {
        expect(wrapper.find('h2')).text().toEqual('Using React and Redux');
    });
    it('Contains input1', () => {
        expect(wrapper.find('input[placeholder="input 1"]'))
    });
    it('Contains input2', () => {
        expect(wrapper.find('input[placeholder="input 2"]'))
    });
     it('Contains output', () => {
        expect(wrapper.find('input[placeholder="output"]'))
    });
    it('Contains button with id="add"', () => {
        expect(wrapper.find('button#add'));
    });
    it('Contains button with id="subtract"', () => {
        expect(wrapper.find('button#subtract'));
    });
});



describe('HOME connected to store',()=>{

    let store, wrapper;

    beforeEach(()=>{
        // On créé un store avec le reducer, cela nous permettra de dispatch une action et
        // de tester le lien entre le Container Home et le store
        store = createStore(calculatorReducers);
        // On créé un render avec shallow, on ajoute le  dive à la fin pour avoir accès
        // à un niveau supplémentaire du domTree
        // https://airbnb.io/enzyme/docs/api/ShallowWrapper/dive.html
        wrapper = shallow( <Provider store={store}><HomeContainer /></Provider> ).dive();
    });

    it('Check store works', () => {

        //On dispatch une action addInput avec le store
        store.dispatch(addInputs(500));

        //Nous récupérons dans le wrapper les informations du container Home
        const containerHome = wrapper.update().find(Home);

        //Nous Récupérons la prop output pour constater qu'elle a bien été mise à jour
        const outputProp = containerHome.prop('output');

        // Nous écrivons enfin l'assertion permettant de confirmer que la props output
        // A bien été modifiée en accord avec l'action dispatchée au store en ligne 81;
        expect(outputProp).toBe(500)
    });

});



describe('HOME mounted',()=>{

    let store, wrapper;
    const fetchRandomNumber = jest.fn().mockResolvedValue(145);


    beforeEach(()=>{
        store = createStore(calculatorReducers);
        wrapper = mount( <HomeContainer store={store} fetchRandomNumber={fetchRandomNumber}/>);
    });


    it('Calculate when Inputs are Filled and ADD is Clicked', () => {

        let input1 = wrapper.find('input').at(0);
        input1.instance().value = 20;

        let input2 = wrapper.find('input').at(1);
        input2.instance().value = 20;

        let addButton = wrapper.find('button').at(0);

        addButton.simulate('click');

        let output = wrapper.find('input').at(2);

        expect(output.prop('value')).toEqual(40);
    });


    it('Calculate when Inputs are Filled and ADD is Clicked', () => {
        let substractButton = wrapper.find('button').at(0);

        substractButton.simulate('click');
        
    });

    it('fetch when asked', () => {

        let fetchButton = wrapper.find('button').at(2);

        fetchButton.simulate('click');
        // on utilise est time out pour simuler l'aspect asynchrone
        setTimeout(checkValue,100);
        // on crée la méthode checkValue et on la test dans le setTimeout
        function checkValue(){
            let input1 = wrapper.find('input').at(0)
            expect (input1.prop('value')).toEqual(145)
        }
    });


});
