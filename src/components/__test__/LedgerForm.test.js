import React from 'react';
import { shallow, mount } from 'enzyme';
import { testItems } from '../../testData';
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
  onCancelSubmit: jest.fn()
}

const props_with_item = {
  ledgerItem: testItems[0],//!
  onFormSubmit: jest.fn(),
  onCancelSubmit: jest.fn()
}

let wrapper,  wrapper2, formInstance;


export const getInputValue = (selector, wrapper) => {
  // return wrapper.instance().find(input).value;//%%% instance沒有find方法!!!
  // return wrapper.find(selector).instance().value;///%%% ShallowWrapper::instance() can only be called on the root
  return wrapper.find(selector).instance().value;
  // return wrapper.getDOMNode().find(selector).instance().value;
}

export const setInputValue = (selector, newValue, wrapper) => {
  wrapper.find(selector).instance().value = newValue;
}
describe('test LedgerForm component', () => {
  beforeEach(()=>{
    wrapper = mount(<LedgerForm {...props}/>);
    wrapper2 = mount(<LedgerForm {...props_with_item}/>)
    // wrapper2 = async()=>{ await mount(<LedgerForm {...props_with_item}/>)}
    // formInstance =
  })
  it('should render the component to match the snapshot',()=>{//%%
    expect(wrapper).toMatchSnapshot();
    expect(wrapper2).toMatchSnapshot();
  })
  //創建
  describe('test LedgerForm with no data', () => {
    //-默認樣式
    //要看到三個input 一個form
    it('render should see three input and one form element',()=>{
      expect(wrapper.find('input').length).toEqual(3);
      expect(wrapper.find('form').length).toEqual(1);
    })
    // 要是空的
    it('render LedgerForm with no data should see three input and no value',()=>{
      expect(getInputValue('#inputTitle',wrapper)).toEqual('');
      // expect(getInputValue('#inputAmount',wrapper).toString().toEqual(''); //%%本來就是字串
      expect(getInputValue('#inputAmount',wrapper)).toEqual('');
      expect(getInputValue('#inputDate',wrapper)).toEqual('');
    })
    //不應該看到alert框(包括背景)%%
    it('should not be seen alert element',()=>{
      expect(wrapper.find('.alert').length).toEqual(0);
    })
    //-交互
    // 空值提交會出現報錯提示
    it('submit form with empty input should show alert message',()=>{
      wrapper.find('#submit').simulate('click');
      // expect(formInstance.state.validatePass).toEqual(false)
      expect(wrapper.find('.alert').length).toEqual(1);
      // expect(props.onFormSubmit).toHaveBeenCalled();//%%
      expect(props.onFormSubmit).not.toHaveBeenCalled();
    })
    // 價格負的提交會錯
    it('submit form with invalid price should show alert message',()=>{
      //%%無法觸發setState更新
      // setInputValue('#inputTitle', 'xxx', wrapper);
      // setInputValue('#inputAmount', -20, wrapper);// @@是否另一邊轉字串
      // setInputValue('#inputDate', '2020-12-14', wrapper);
      act(()=>{
        wrapper.find('#inputTitle').simulate('change',{ target:{value:'xxx'}});
        // wrapper.find('#inputAmount').simulate('change',{ target:{value:-20}});//%%改字串才能trim TypeError: e.target.value.trim is not a function
        wrapper.find('#inputAmount').simulate('change',{ target:{value:'-40'}});
        wrapper.find('#inputDate').simulate('change',{ target:{value:'2020-12-14'}});
      })
      wrapper.update();
      wrapper.find('#submit').simulate('click');
      expect(wrapper.find('.alert').length).toEqual(1);
      expect(wrapper.find('.alert').text()).toEqual('數字不能為負');
      expect(props.onFormSubmit).not.toHaveBeenCalled();
    })
    // 日期不符格式提交會錯
    it('submit form with invalid date should show alert message',()=>{
      act(()=>{
        wrapper.find('#inputTitle').simulate('change',{ target:{value:'xxx'}});
        wrapper.find('#inputAmount').simulate('change',{ target:{value:'30'}});
        wrapper.find('#inputDate').simulate('change',{ target:{value:'2021-12-14'}});
      })
      wrapper.update();
      wrapper.find('#submit').simulate('click');
      expect(wrapper.find('.alert').length).toEqual(1);
      expect(wrapper.find('.alert').text()).toEqual('不能選擇未來的日期');
      expect(props.onFormSubmit).not.toHaveBeenCalled();
    })
    // 填寫正確提交會觸發回呼帶參數
    // it('submit form with valid data should invoke right function with right item',()=>{})
    it('submit form with valid data should trigger callback with right object',()=>{
      act(()=>{
        wrapper.find('#inputTitle').simulate('change',{ target:{value:'吃飯'}});
        wrapper.find('#inputAmount').simulate('change',{ target:{value:'300'}});
        wrapper.find('#inputDate').simulate('change',{ target:{value:'2020-12-13'}});
      })
      wrapper.update();
      wrapper.find('#submit').simulate('click');
      // console.log(wrapper.debug());
      expect(wrapper.find('.alert').length).toEqual(0);
      expect(props.onFormSubmit).toHaveBeenCalled();
    })
    // 點取消會觸發回調%%
    it('click the cancel button should call the right callback',()=>{
      act(()=>{
        wrapper.find('#inputTitle').simulate('change',{ target:{value:'吃飯'}});
        wrapper.find('#inputAmount').simulate('change',{ target:{value:'300'}});
        wrapper.find('#inputDate').simulate('change',{ target:{value:'2020-12-13'}});
      })
      wrapper.update();
      wrapper.find('#cancel').simulate('click');
      expect(props.onFormSubmit).not.toHaveBeenCalled();
      expect(props.onCancelSubmit).toHaveBeenCalled();//@@這邊測試時期的處置
    });
  })

  //編輯
  describe('test LedgerForm with item data', () => {
    //默認
    //要看到三個input有資料
    // it('render the three input with value',()=>{})
    // it('render LegerFrom with item should render correct data to input',()=>{
    //   // expect(getInputValue('#inputTitle',wrapper2)).toEqual(ledgerItem.title)//%%即使上面解構這邊一樣會讀取不到
    //   // expect(getInputValue('#inputTitle',wrapper2)).toEqual(props.ledgerItem.title);//%%@@同樣不行 就算expect也是抓上面變數的
    //   expect(getInputValue('#inputTitle',wrapper2)).toEqual(testItems[0].title);
    //   expect(getInputValue('#inputAmount',wrapper2)).toEqual(testItems[0].amount.toString());
    //   expect(getInputValue('#inputDate',wrapper2)).toEqual(testItems[0].date);
    // })
    //交互
    // 使用者編輯後，會把對的資料物件呼叫出去
    // it('submit with valid data should call the right callback with right object',()=>{})
    it('submit with change value should trigger callback with right object',()=>{
      // jest.spyOn(React, 'useEffect').mockImplementation(f => f())
      wrapper2.update();
      const mockSetState = jest.fn();
      React.useState = jest.fn(()=>(['',mockSetState]));
      // act(()=>{
        wrapper2.find('#inputTitle').simulate('change',{ target:{value:'工資'}});
        wrapper2.find('#inputAmount').simulate('change',{ target:{value:'2000'}});
        wrapper2.find('#inputDate').simulate('change',{ target:{value:'2020-12-13'}});
        // wrapper2.find('#inputTitle').props().onChange({ target:{value:'工資'}});
        // wrapper2.find('#inputTitle').prop('onChange')({ target:{value:'工資'}});
        // wrapper2.find('#inputAmount').props().onChange({ target:{value:'2000'}});
        // wrapper2.find('#inputDate').props().onChange({ target:{value:'2020-12-13'}});
        // wrapper2.find('#submit').simulate('click',{preventDefault(){}});
        wrapper2.find('#submit').simulate('click');
        // const newItem = {...testItems[0],title:'工資',amount:2000,date:'2020-12-13'};
        // expect(props.onFormSubmit).toHaveBeenCalledWith(newItem);//%%Number of calls: 0
      // })
      wrapper2.update();
      // wrapper2 =  wrapper2.update();
      const newItem = {...props_with_item.ledgerItem,title:'工資',amount:2000,date:'2020-12-13'};
      // expect(props_with_item.onFormSubmit).toHaveBeenCalledWith(newItem);//@@哪個好
      // expect(wrapper2.props().onFormSubmit).toHaveBeenCalledWith(newItem);
      // expect(mockSetState).toHaveBeenCalledWith('2020-12-13');
      setTimeout(()=>{
        expect(wrapper2.props().onFormSubmit).toHaveBeenCalledWith(newItem,true);
      },0)

    })
  })



})
