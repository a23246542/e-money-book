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
]
const props = {
  categories,
  onSelectCategory: jest.fn(),
}

const props_with_category = {
  categories,
  selectedCategory: {
    "id": "1",
    "name": "旅行",
    "type": "outcome",
    "iconName": "IosPlane",
  },
  onSelectCategory: jest.fn(),
}

let wrapper;

describe('test CategorySelect component',()=>{
  //~~要給不同props就不用beforeEach

  // beforeEach(()=>{
  //   wrapper = shallow(<CategorySelect>)
  // })

  it('should render the component to match the snapshot',() => {
    wrapper = shallow(<CategorySelect {...props_with_category}/>)
    expect(wrapper).toMatchSnapshot();
  })
  //~~~with傳入的意思
  it('render with categories should render the correct times and icon',()=>{
    wrapper = shallow(<CategorySelect {...props}/>);
    // wrapper.debug();
    // expect(wrapper.find('.category-item').length).toEqual(3);//%%%
    expect(wrapper.find('.category-item').length).toEqual(categories.length);
    // expect(wrapper.find('.category-icon').first().props('icon')).toEqual('IosPlane')
    expect(wrapper.find('.category.active').length).toEqual(0);

    // @@為什麼這會收到這個 Received: {"color": "#ccc", "fontSize": "50px", "icon": "IosPlane"}
    // expect(wrapper.find(Icon).first().props('icon')).toEqual('IosPlane')
    // expect(wrapper.find(Icon).first().props().icon).toEqual('IosPlane');//%%%
    const firstIcon = wrapper.find(Icon).first();
    expect(firstIcon.length).toEqual(1);
    expect(firstIcon.props().icon).toEqual(categories[0].iconName);//%%%
  })

  it('render with selectedCategory should highlight the correct item',()=>{
    wrapper = shallow(<CategorySelect {...props_with_category}/>);
    expect(wrapper.find('.category-item').first().hasClass('active')).toEqual(true);
  })

  it('click the item should add active class and trigger the callback',()=>{
    wrapper = shallow(<CategorySelect {...props_with_category}/>)
    wrapper.find('.category-item').at(1).simulate('click',{ preventDefault: () => {} });//@@
    //@@所以這些狀態功能展示組件不用測
    // expect(wrapper.find('.category-item').at(0).hasClass('active')).toEqual(false);
    // expect(wrapper.find('.category-item').at(1).hasClass('active')).toEqual(true);
    // expect(props_with_category.onSelectCategory.hasBenn)//%%
    expect(props_with_category.onSelectCategory).toHaveBeenCalledWith(props_with_category.categories[1]);
  })
})
