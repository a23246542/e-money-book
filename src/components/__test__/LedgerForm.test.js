import React from 'react';
import { shallow } from 'enzyme';
import { testItems } from '../../testData';
import LedgerForm from '../LedgerForm';

// 需求分析
//分創建跟編輯
//基本驗證內容
//提交跟取消會回調

//先props
const props = {
  onFormSubmit: jest.fn(),
  onCancelSubmit: jest.fn()
}

const props_with_item = {

}

let wrapper,  wrapper2, formInstance;


describe('test LedgerForm component', () => {
  beforeEach(()=>{
    wrapper = shallow(<LedgerForm {...props}/>);
    wrapper2 = shallow(<LedgerForm {...props_with_item}/>)
    // formInstance =
  })
  it('should render the component to match the snapshot',()=>{//%%
    expect(wrapper).toMatchSnapshot();
    expect(wrapper2).toMatchSnapshot();
  })
  //創建
  describe('test LedgerForm with no data ', () => {
    //-默認樣式
    //要看到三個input 一個form
    it('render should see three input and one form element',()=>{})
    // 要是空的
    it('render LedgerForm with no data should see three input and no value',()=>{})
    //-交互
    // 空值提交會出現報錯提示
    it('submit form with empty input should show alert message',()=>{})
    // 價格負的提交會錯
    it('submit form with invalid price should show alert message',()=>{})
    // 日期不符格式提交會錯
    it('submit form with invalid date should show alert message',()=>{})
    // 填寫正確提交會觸發回呼帶參數
    // it('submit form with valid data should invoke right function with right item',()=>{})
    it('submit form with valid data should trigger callback with right object',()=>{})
    // 點取消會觸發回調%%
    it('click the cancel button should call the right callback',()=>{});
  })

  //編輯
  describe('test LedgerForm with item data', () => {
    //默認
    //要看到三個input有資料
    // it('render the three input with value',()=>{})
    it('render LegerFrom with item should render correct data to input',()=>{})
    //交互
    // 都改ok後，會把對的資料物件呼叫出去
    // it('submit with valid data should call the right callback with right object',()=>{})
    it('submit with change value should trigger callback with right object',()=>{})
  })



})
