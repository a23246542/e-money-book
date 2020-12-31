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

const testItem = testItems[1];
const match = {};
const history = {};

const initData = {
  ledgerStore:{},
  categories:{},
  isLoading:false,
  currentDate: parseToYearsAndMonth()
}
const loadingData = {
  ...initData,
  isLoading: true,
}

const actions = {
  // getEditData:jest.fn().mockReturnValue({id:testItem.id}),//%%&
  getEditData: jest.fn().mockReturnValue(Promise.resolve({ editItem: testItem, categories: flattenArr(testCategories)})),
  // getEditData: jest.fn().mockReturnValue(new Promise({ editItem: testItem, categories: flattenArr(testCategories)})),
  // getEditData: jest.fn().mockReturnValue(Promise.resolve(33)),
}
const withLoadedData = {
  ledgerStore: flattenArr(testItems),
  categories: flattenArr(testCategories),
  isLoading:false,
  currentDate:parseToYearsAndMonth(),
  actions
}


describe('test Create component init behavior', () => {
  it('test Create page for the first render，getEditData should be called with right params',(done)=>{
    const wrapper = mount(
      <Router>
        <Provider value={withLoadedData}>
          <Create match={match} history={history} />
        </Provider>
      </Router>
    )
    setTimeout(()=>{
      wrapper.update();
      expect(actions.getEditData).toHaveBeenCalledWith(testItem.id);
      done();
    },100)
  })
});


