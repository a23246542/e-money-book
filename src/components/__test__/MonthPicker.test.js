import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { MonthPicker } from '@/components';

let props = {
  year: 2020,
  month: 12,
  choiceDate: jest.fn(),
};

let wrapper;

describe('test MonthPicker component', () => {
  beforeEach(() => {
    wrapper = mount(<MonthPicker {...props} />);
  });

  it('should render the component to match the snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
  it('render the correct year and month, not show dropdown', () => {
    const btnText = wrapper.find('.dropdown-toggle').first().text();
    expect(btnText).toBe('2020年 12月');
    expect(wrapper.find('.dropdown-menu').first().length).toBe(0);
  });

  it('after click the button, dropdown should show', () => {
    wrapper.find('.dropdown-toggle').first().simulate('click');
    expect(wrapper.find('.dropdown-menu').length).toEqual(1);
  });

  it('after click the button, list&month should have the correct items', () => {
    wrapper.find('.dropdown-toggle').simulate('click');
    //驗證年跟月的長度正確
    expect(wrapper.find('.years-range .dropdown-item').length).toBe(9);
    expect(wrapper.find('.months-range .dropdown-item').length).toBe(12);
    //驗證高亮的年月是對的顯示
    expect(wrapper.find('.years-range .dropdown-item.active').text()).toBe(
      '2020年'
    );
    expect(wrapper.find('.months-range .dropdown-item.active').text()).toBe(
      '12月'
    );
    //顯示的跟傳進去的邏輯要相通 驗證第一項
    expect(wrapper.find('.years-range .dropdown-item').first().text()).toBe(
      `${props.year - 4}年`
    );
    expect(wrapper.find('.months-range .dropdown-item').first().text()).toBe(
      '01月'
    );
  });

  it('click the year&month item, should trigger the right status change', () => {
    wrapper.find('.dropdown-toggle').simulate('click');
    wrapper.find('.years-range .dropdown-item').first().simulate('click');
    expect(
      wrapper.find('.years-range .dropdown-item').first().hasClass('active')
    ).toBe(true);
    wrapper.find('.months-range .dropdown-item').first().simulate('click');
    expect(wrapper.find('.dropdown-menu').length).toBe(0);
    expect(wrapper.find('.dropdown-toggle').text()).toBe('2016年 01月');
    expect(wrapper.props().choiceDate).toHaveBeenCalledWith(2016, 1);
  });

  it('after the dropdown is shown，click the document should close the dropdown', () => {
    let eventMap = {};
    document.addEventListener = jest.fn((event, cb) => {
      eventMap[event] = cb;
    });
    wrapper = mount(<MonthPicker {...props} />);
    wrapper.find('.dropdown-toggle').simulate('click');

    act(() => {
      eventMap.click({
        // target:ReactDOM.findDOMNode(wrapper.instance()),//被废弃
        target: wrapper.getDOMNode(),
      });
    });
    wrapper.update();
    expect(wrapper.find('.dropdown-menu').length).toEqual(1);
    act(() => {
      eventMap.click({
        target: document,
      });
    });
    wrapper.update();
    expect(wrapper.find('.dropdown-menu').length).toEqual(0);
  });
});
