import React,{ useState, useMemo, useEffect, useContext } from 'react'
import { shallow, mount} from 'enzyme';
import { BrowserRouter as Router, withRouter } from 'react-router-dom';
import Create from '../Create';
import { parseToYearsAndMonth, flattenArr, makeArrByRange} from '../../utility';
import Loader from '../../components/common/Loader';
import CategorySelect from '../../components/CategorySelect';
import LedgerForm from '../../components/LedgerForm';
import { testCategories, testItems } from '../../testData';
import AppContext, { Provider } from '../../AppContext';
import act from 'react-dom/test-utils';

const testItem = testItems[1];
const match = {};
const history = {};

const actions = {
  // getEditData:jest.fn().mockReturnValue({id:testItem.id}),//%%&
  getEditData: jest.fn().mockReturnValue(Promise.resolve({ editItem: testItem, categories: flattenArr(testCategories)})),
  // getEditData: jest.fn().mockReturnValue({then:jest.fn()}),
  // getEditData: jest.fn().mockReturnValue(new Promise((resolve=>{resolve({ editItem: testItem, categories: flattenArr(testCategories)})}))),
  // getEditData: jest.fn().mockReturnValue(new Promise({ editItem: testItem, categories: flattenArr(testCategories)})),
  // getEditData: jest.fn().mockReturnValue(Promise.resolve(33)),
  createData: jest.fn().mockReturnValueOnce(Promise.resolve('')),
  editData: jest.fn().mockReturnValueOnce(Promise.resolve(''))
}
const initData = {
  ledgerStore:{},
  categories:{},
  isLoading:false,
  currentDate: parseToYearsAndMonth(),
  actions
}
const loadingData = {
  ...initData,
  isLoading: true,
}
const withLoadedData = {
  ledgerStore: flattenArr(testItems),
  categories: flattenArr(testCategories),
  isLoading:false,
  currentDate:parseToYearsAndMonth(),
  actions
}

let wrapper;

describe('test Create component init behavior', () => {
  beforeEach(async()=>{
    wrapper = mount(
      <Router>
        <AppContext.Provider value={initData}>
          <Create match={match} history={history} />
        </AppContext.Provider>
      </Router>
    )
    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise(resolve => setTimeout(resolve, 0));
      // await new Promise(resolve => setImmediate(resolve));
      wrapper.update();
    });

  })

  const setInputValue = (selector, newValue) => {
    wrapper.find(selector).instance().value = newValue
  }

  it('test Create page for the first render，getEditData should be called with right params',async(done)=>{
    setTimeout(async()=>{
      wrapper.update();
      expect(actions.getEditData).toHaveBeenCalledWith(testItem.id);
      done();
    },100)
  })

  it('should pass the null to props selectedCategory for CategorySelect', () => {
    expect(wrapper.find(CategorySelect).props().selectedCategory).toEqual(null)
  })

  it('should pass empty object for PriceForm', () => {
    expect(wrapper.find(LedgerForm).props().ledgerItem).toEqual({})
    // expect(wrapper.find(CreatePage).state('selectedTab')).toEqual(TYPE_OUTCOME)
  })

  it('submit the form, the addItem should not be triggered', () => {
    wrapper.find('form').simulate('submit')
    expect(actions.createData).not.toHaveBeenCalled()
  })

  it('fill all inputs, and select the category, submit the form, addItem should be called', () => {
    setInputValue('#inputTitle', 'new title')
    setInputValue('#inputAmount', '200')
    setInputValue('#inputDate', '2018-08-30')
    wrapper.find('.category-item').first().simulate('click')
    wrapper.find('form').simulate('submit')
    const testData = {title: 'new title', price: 200 , date: '2018-08-30'}
    expect(actions.createData).toHaveBeenCalledWith(testData, testCategories[0].id)
  })

});


describe('test component when in edit mode', () => {
  beforeEach(async()=>{
    wrapper = mount(
      <Router>
        <AppContext.Provider value={initData}>
          <Create match={match} history={history} />
        </AppContext.Provider>
      </Router>
    )
  })

  const setInputValue = (selector, newValue) => {
    wrapper.find(selector).instance().value = newValue
  }

  const selectedCategory = testCategories.find(category => testItem.cid === category.id)

  it('should pass the right category to props selectedCategory for CategorySelect', () => {
    wrapper.update()
    expect(wrapper.find(CategorySelect).props().selectedCategory).toEqual(selectedCategory)
  })

  it('modify some inputs and submit the form, modifyItem should be called', () => {
    setInputValue('#title', 'new title')
    wrapper.find('form').simulate('submit')
    const testData = {...testItem, title: 'new title'}
    expect(actions.editData).toHaveBeenCalledWith(testData, selectedCategory.id)
  })
})


