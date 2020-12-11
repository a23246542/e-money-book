/* globals describe, expect, it */ 
import React from 'react';
import { shallow, mount } from 'enzyme';
import CategorySelect from '../CategorySelect';
import Icon from '../common/Icon';
// import "jest-fix-undefined";


export const categories = [
  {
   "id": "1",
   "name": "旅行",
   "type": "outcome",
   "iconName": "IosPlane",    
 },
  {
   "id": "2",
   "name": "理财",
   "type": "income",
  //  "iconName": "logo-yen", 
  //  "iconName": "ios-plane", 
   "iconName": "IosPaper", 
 },
 {
   "id": "3",
   "name": "理财",
   "type": "income",
   "iconName": "IosPlane", 
 },
 {
   "id": "4",
   "name": "理财",
   "type": "income",
   "iconName": "IosPlane", 
 }
]
const props = {
  categories,
  // onSelectCategory: jest.fn(),
}

const props_with_category = {
  categories,
  selectedCategory: {},
  // onSelectCategory: jest.fn(),
}

let wrapper;

// describe('test CategorySelect component',()=>{
//   //~~要給不同props就不用beforeEach

//   // beforeEach(()=>{
//   //   wrapper = shallow(<CategorySelect>)
//   // })

//   it('should render the component to match the snapshot',() => {
//     wrapper = shallow(<CategorySelect {...props_with_category}/>)
//     expect(wrapper).toMatchSnapshot();
//   })
//   //~~~with傳入的意思
//   it('render with categories should render the correct times and icon',()=>{
//     wrapper = shallow(<CategorySelect {...props}/>);
//     // wrapper.debug();
//     expect(wrapper.find('.category-item').length).toEqual(3);
//     // expect(wrapper.find('.category-icon').first().props('icon')).toEqual('IosPlane')

//     // @@為什麼這會收到這個 Received: {"color": "#ccc", "fontSize": "50px", "icon": "IosPlane"}
//     // expect(wrapper.find(Icon).first().props('icon')).toEqual('IosPlane')
//     expect(wrapper.find(Icon).first().props().icon).toEqual('IosPlane')
//   })

//   it('render with selectedCategory should highlight the correct item',()=>{})

//   it('click the item should add active class and trigger the callback',()=>{})
// })