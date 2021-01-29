import React from 'react';
import {
  mount
} from 'enzyme';
import {
  Tabs,
  Tab
} from '../Tabs';

const props = {
  activeIndex: 0,
  onTabChange: jest.fn(),
};
let wrapper = {};

describe('test Tabs and Tab component', () => {
  beforeEach(() => {
    wrapper = mount(
    <Tabs {...props} >
      <Tab > 1 </Tab>
      <Tab > 2 </Tab>
    </Tabs>
    );
  });
  //渲染組件要符合快照
  it('should render the component to match the snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  //測試默認渲染render兩個tab(length)，第一個標籤要是active
  it('should render two Tab component，first one should be active', () => {
    expect(wrapper.find(Tab).length).toEqual(2);
    expect(wrapper.find('[data-test="navItem"]').length).toBe(2);
    expect(wrapper.find('.nav-link').first().hasClass('active')).toEqual(true);
  });
  // 測試交互後的畫面變化
  it('click the 2nd Tab should change the active tab and trigger the right function', () => {
    wrapper.find('.nav-link').last().simulate('click',{preventDefault(){}});
    expect(wrapper.props().onTabChange).toHaveBeenCalledWith(1);

    wrapper.setProps({
      activeIndex: 1
    });
    expect(wrapper.find('.nav-link').first().hasClass('active')).toEqual(false);
    expect(wrapper.find('.nav-link').last().hasClass('active')).toEqual(true);
  });
});
