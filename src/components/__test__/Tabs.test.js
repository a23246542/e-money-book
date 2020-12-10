import React from 'react';
import { shallow, mount } from 'enzyme';
import { render,fireEvent } from '@testing-library/react';
import { toBeInTheDocument } from '@testing-library/jest-dom';
import { Tabs, Tab} from '../Tabs';

const props = {
  activeIndex:0,
  onTabChange:jest.fn()
};
let wrapper = {};

describe('test Tabs and Tab component', ()=>{
  //進行每個最小用例之前，重新shallow
  beforeEach(()=>{
    // wrapper = mount(
    //   <Tabs {...props}>
    //     <Tab>1</Tab>
    //     <Tab>2</Tab>
    //   </Tabs>
    // )
    // const { getByTestId } = render(
    //   <Tabs {...props}>
    //     <Tab>1</Tab>
    //     <Tab>2</Tab>
    //   </Tabs>
    // )
  })
  //渲染組件要符合快照
  // it('should render the component to match the snapshot',()=>{
  //   expect(wrapper).toMatchSnapshot();
  // })
  // test('render',()=>{
  //   const { getByTestId } = render(
  //     <Tabs {...props}>
  //       <Tab>1</Tab>
  //       <Tab>2</Tab>
  //     </Tabs>
  //   )
  //   expect(getByTestId('navTabs')).toBeInTheDocument();
  // })
  //默認渲染兩個tab，第一個標籤要是active
  
  //交互點第二個tab會改變active狀態跟觸發對的函式
  test('click',()=>{
    let container;
    const { getByTestId, debug } = render(
      <Tabs {...props}>
        <Tab>1</Tab>
        <Tab>2</Tab>
      </Tabs>
    ,container)
    fireEvent.click(getByTestId('navTabs').lastChild.firstChild,{index:1});
    // debug();
    expect(getByTestId('navTabs').firstChild.firstChild.classList.contains('active')).toBe(false)
    expect(getByTestId('navTabs').lastChild.firstChild.classList.contains('active')).toBe(true)
    // expect(getByTestId('navTabs').firstChild.firstChild.toHaveClass('active')).toBe(true)
    //不測試state
    
  })
  // it('click the 2nd Tab should change the active stauts and trigger the right function', () => {
  //   wrapper.find('.nav-link').last().simulate('click', { preventDefault: () => {}})
  //   expect(wrapper.find('.nav-link').first().hasClass('active')).toEqual(false)
  //   expect(wrapper.find('.nav-link').last().hasClass('active')).toEqual(true)
  //   // expect(wrapper.instance().state.Index).toEqual(1)
  //   // expect(props.onTabChange).toHaveBeenCalledWith(1)
  // })
})