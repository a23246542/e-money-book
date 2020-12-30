import React,{ useState, useMemo, useEffect, useContext } from 'react'
import Create from '../Create';
import { parseToYearsAndMonth, flattenArr, makeArrByRange} from '../../utility';
import Loader from '../../components/common/Loader';
import CategorySelect from '../../components/CategorySelect';
import LedgerForm from '../../components/LedgerForm';
import { testCategories, testItems } from '../testData';

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

const withLoadedData = {
  ledgerStore: flattenArr(testItems),
  categories: flattenArr(testCategories),
  isLoading:false,
  currentDate:parseToYearsAndMonth(),
}

const actions = {
  getEditData:jest.fn().mockReturnValue({id:testItem.id}),
}

describe('test Create component init behavior', () => {
  it('test Create page for the first render，getEditData should be called with right params',()=>{
    const wrapper = mount(
      <Create match={match} history={history} />
    )
    expect(actions.getEditData).toHaveBeenCalled(testItem.id);
  })
});


