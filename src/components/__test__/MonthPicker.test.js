import React from 'react'
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils'
import { mount } from 'enzyme'
import MonthPicker from '../MonthPicker'

let props = {
  year: 2020,
  month: 12,
  onChange: jest.fn()
}

let wrapper

describe('test MonthPicker component', () => {
  beforeEach(() => {
    wrapper = mount(<MonthPicker {...props} />)
  })
  it('should render the component to match the snapshot', () => {
    expect(wrapper).toMatchSnapshot()
  })
  it('render the correct now year and month',()=>{
    const btnText = wrapper.find('.dropdown-toggle').first().text();
    expect(btnText).toEqual('2020年 12月');
  })

  //@@目前查非class組件無法檢測狀態
  it('show correct dropdown status',()=>{
    //下拉菜單一開始不會顯示
    expect(wrapper.find('.dropdown-menu').first().length).toEqual(0)
    // expect(wrapper.state().isOpen).toEqual(false)
    // expect(wrapper.state('selectedYear')).toEqual(props.year)
  })

  it('after click the button, dropdown should show',()=>{
    wrapper.find('.dropdown-toggle').first().simulate('click');
    // expect(wrapper.state('isOpen')).toEqual(true)
    expect(wrapper.find('.dropdown').length).toEqual(1)
  })

  it('after click the button, list&month should have the correct items', ()=>{
    wrapper.find('.dropdown-toggle').first().simulate('click');
    //驗證年跟月的長度正確
    expect(wrapper.find('.years-range .dropdown-item').length)
    .toEqual(9);
    expect(wrapper.find('.months-range .dropdown-item').length)
    .toEqual(12);
    //驗證高亮的年月是對的顯示
    // @@first的時機 如果確定只會有一項就免
    // expect(wrapper.find('.years-range .dropdown-item.active').first().text())
    expect(wrapper.find('.years-range .dropdown-item.active').text())
    .toEqual('2020年');
    expect(wrapper.find('.months-range .dropdown-item.active').text())
    .toEqual('12月');
    //顯示的跟傳進去的邏輯要相通 驗證第一項
    expect(wrapper.find('.years-range .dropdown-item').first().text())
    .toEqual(`${props.year-4}年`);
    expect(wrapper.find('.months-range .dropdown-item').first().text())
    .toEqual('01月');
  })

  it('click the year&month item, should trigger the right status change',()=>{})

  it('after the dropdown is shown，click the document should close the dropdown',()=>{
    let eventMap = {};
    // @@jest.fn作用
    document.addEventListener = jest.fn((event, cb)=>{
      eventMap[event] = cb;
    })
    wrapper = mount(<MonthPicker {...props}/>);
    wrapper.find('.dropdown-toggle').simulate('click');

    // 模拟点位置，click()=docHandleClick()
    act(()=>{
      eventMap.click({
        // target:ReactDOM.findDOMNode(wrapper.instance()),//!!!@@wrapper.instance()被废弃
        target:wrapper.getDOMNode(),//!!!@@
      })
    })
    wrapper.update();
    expect(wrapper.find('.dropdown-menu').length).toEqual(1);
    act(()=>{
      eventMap.click({
        target:document,
      })
    })
    wrapper.update();
    expect(wrapper.find('.dropdown-menu').length).toEqual(0);

  })
})
