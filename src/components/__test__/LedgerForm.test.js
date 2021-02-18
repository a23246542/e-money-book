import React from 'react';
import { mount } from 'enzyme';
import { testItems } from '../../helpers/testData';
import LedgerForm from '../LedgerForm';
import { act } from 'react-dom/test-utils';

// 需求分析
//分創建跟編輯
//基本驗證內容
//提交跟取消會回調

//先props
const props = {
  ledgerItem: {},
  onFormSubmit: jest.fn(),
  onCancelSubmit: jest.fn(),
};

const props_with_item = {
  ledgerItem: testItems[0], //!
  onFormSubmit: jest.fn(),
  onCancelSubmit: jest.fn(),
};

let wrapper, wrapper2, formInstance;

export const getInputValue = (selector, wrapper) => {
  return wrapper.find(selector).instance().value;
};
export const setInputValue = (selector, newValue, wrapper) => {
  wrapper.find(selector).instance().value = newValue;
};

describe('test LedgerForm component', () => {
  beforeEach(() => {
    wrapper = mount(<LedgerForm {...props} />);
    wrapper2 = mount(<LedgerForm {...props_with_item} />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should render the component to match the snapshot', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper2).toMatchSnapshot();
  });
  //創建
  describe('test LedgerForm with no data', () => {
    //-默認樣式
    //要看到三個input 一個form
    it('render should see three input and one form element', () => {
      expect(wrapper.find('input').length).toEqual(3);
      expect(wrapper.find('form').length).toEqual(1);
    });
    // 要是空的
    it('render LedgerForm with no data should see three input and no value', () => {
      expect(getInputValue('#inputTitle', wrapper)).toEqual('');
      expect(getInputValue('#inputAmount', wrapper)).toEqual('0'); //
      expect(getInputValue('#inputDate', wrapper)).toEqual('');
    });
    it('should not be seen alert element', () => {
      expect(wrapper.find('.alert').length).toEqual(0);
    });
    //-交互
    // 空值提交會出現報錯提示
    it('submit form with empty input should show alert message', () => {
      wrapper.find('#submit').simulate('click');
      expect(wrapper.find('.alert').length).toEqual(1);
      expect(props.onFormSubmit).not.toHaveBeenCalled();
    });
    // 價格負的提交會錯
    it('submit form with invalid price should show alert message', () => {
      act(() => {
        wrapper.find('#inputTitle').simulate('change', {
          target: {
            value: 'xxx',
          },
        });
        // wrapper.find('#inputAmount').simulate('change',{ target:{value:-20}});//%%改字串才能trim TypeError: e.target.value.trim is not a function
        wrapper.find('#inputAmount').simulate('change', {
          target: {
            value: '-40',
          },
        });
        wrapper.find('#inputDate').simulate('change', {
          target: {
            value: '2020-12-14',
          },
        });
      });
      wrapper.update();
      wrapper.find('#submit').simulate('click');
      expect(wrapper.find('.alert').length).toEqual(1);
      expect(wrapper.find('.alert').text()).toEqual('數字不能為負');
      expect(props.onFormSubmit).not.toHaveBeenCalled();
    });
    // 日期不符格式提交會錯
    it('submit form with invalid date should show alert message', () => {
      act(() => {
        wrapper.find('#inputTitle').simulate('change', {
          target: {
            value: 'xxx',
          },
        });
        wrapper.find('#inputAmount').simulate('change', {
          target: {
            value: '30',
          },
        });
        wrapper.find('#inputDate').simulate('change', {
          target: {
            value: '2022-12-14',
          },
        });
      });
      wrapper.update();
      wrapper.find('#submit').simulate('click');
      expect(wrapper.find('.alert').length).toEqual(1);
      expect(wrapper.find('.alert').text()).toEqual('不能選擇未來的日期');
      expect(props.onFormSubmit).not.toHaveBeenCalled();
    });
    // 填寫正確提交會觸發回呼帶參數
    it('submit form with valid data should invoke callback with right object', () => {
      act(() => {
        wrapper.find('#inputTitle').simulate('change', {
          target: {
            value: '吃飯',
          },
        });
        wrapper.find('#inputAmount').simulate('change', {
          target: {
            value: '300',
          },
        });
        wrapper.find('#inputDate').simulate('change', {
          target: {
            value: '2020-12-13',
          },
        });
      });
      wrapper.update();
      wrapper.find('#submit').simulate('click');
      const newItem = {
        title: '吃飯',
        amount: 300,
        date: '2020-12-13',
      };
      expect(wrapper.find('.alert').length).toEqual(0);
      expect(props.onFormSubmit).toHaveBeenCalledWith(newItem, false);
    });
    // 點取消會觸發回調
    it('click the cancel button should call the right callback', () => {
      act(() => {
        wrapper.find('#inputTitle').simulate('change', {
          target: {
            value: '吃飯',
          },
        });
        wrapper.find('#inputAmount').simulate('change', {
          target: {
            value: '300',
          },
        });
        wrapper.find('#inputDate').simulate('change', {
          target: {
            value: '2020-12-13',
          },
        });
      });
      wrapper.update();
      wrapper.find('#cancel').simulate('click');
      // console.log(props.onFormSubmit.mock);

      expect(props.onFormSubmit).not.toHaveBeenCalled(); // 需clearAllMocks
      expect(props.onCancelSubmit).toHaveBeenCalled();
    });
  });

  //編輯
  describe('test LedgerForm with item data', () => {
    //默認
    //要看到三個input有資料
    it('render LedgerForm with item should see the correct data to inputs', () => {
      expect(getInputValue('#inputTitle', wrapper2)).toEqual(
        testItems[0].title
      );
      expect(getInputValue('#inputAmount', wrapper2)).toEqual(
        testItems[0].amount.toString()
      );
      expect(getInputValue('#inputDate', wrapper2)).toEqual(testItems[0].date);
    });
    //交互
    // 使用者編輯後，會把對的資料物件呼叫出去
    it('submit with change value should call the callback with right object', () => {
      wrapper2.find('#inputTitle').simulate('change', {
        target: {
          value: '股息',
        },
      });
      wrapper2.find('#inputAmount').simulate('change', {
        target: {
          value: '2000',
        },
      });
      wrapper2.find('#inputDate').simulate('change', {
        target: {
          value: '2020-12-13',
        },
      });
      wrapper2.update();
      wrapper2.find('#submit').simulate('click', {
        preventDefault() {},
      });
      const newItem = {
        ...props_with_item.ledgerItem,
        title: '股息',
        amount: 2000,
        date: '2020-12-13',
      };

      // expect(props_with_item.onFormSubmit).toHaveBeenCalledWith(newItem, true);
      expect(wrapper2.props().onFormSubmit).toHaveBeenCalledWith(
        // 也可以
        newItem,
        true
      );
    });
  });
});
