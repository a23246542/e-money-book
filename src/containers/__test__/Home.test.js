import React from 'react';
import { mount } from 'enzyme';
// import { MemoryRouter, BrowserRouter as Router } from 'react-router-dom';
import { MemoryRouter, Router } from 'react-router-dom';
import Home, { HomePage } from '../Home';
import {
  parseToYearsAndMonth,
  flattenArr,
  LIST_VIEW,
  CHART_VIEW,
} from '../../helpers/utility';
import Loader from '../../components/common/Loader';
import LedgerList from '../../components/LedgerList';
import { Tabs } from '../../components/Tabs';
import ViewTab from '../../components/ViewTab';
import PieChart from '../../components/PieChart';
import AppContext from '../../contexts/AppContext';
import { testCategories, testItems } from '../../helpers/testData';

const actions = {
  getInitData: jest.fn(),
  selectNewMonth: jest.fn(),
  deleteData: jest.fn(),
};

const initData = {
  categories: {},
  ledgerStore: {},
  currentDate: parseToYearsAndMonth(),
  isLoading: false,
  // categoriesIsLoaded: false,
  actions,
};
const withLoadingData = {
  ...initData,
  isLoading: true,
};
const withLoadedData = {
  categories: flattenArr(testCategories),
  ledgerStore: flattenArr(testItems),
  currentDate: parseToYearsAndMonth(),
  isLoading: false,
  actions,
};

let wrapper;

describe('test Home component init behavior', () => {
  //一開始沒有記帳紀錄
  it('test home container first render, without any data, getInitData should be called', () => {
    wrapper = mount(
      <MemoryRouter>
        <AppContext.Provider value={initData}>
          <Home />
        </AppContext.Provider>
      </MemoryRouter>
    );
    expect(actions.getInitData).toHaveBeenCalled();
    expect(wrapper.find('.no-record').length).toEqual(1);
  });

  //拿資料有loading狀態
  it('test home container with loading state, loading icon should show up', () => {
    wrapper = mount(
      <MemoryRouter>
        <AppContext.Provider value={withLoadingData}>
          <Home />
        </AppContext.Provider>
      </MemoryRouter>
    );
    expect(wrapper.find(Loader).length).toEqual(1);
  });
});

//首頁拿到資料後
describe('test home component with loaded data', () => {
  const wrapper = mount(
    <MemoryRouter>
      <AppContext.Provider value={withLoadedData}>
        <Home />
      </AppContext.Provider>
    </MemoryRouter>
  );
  //一開始顯示list條目及tab
  it('should show price list and view tab', () => {
    expect(wrapper.find(LedgerList).length).toEqual(1);
    expect(wrapper.find(Tabs).length).toEqual(1);
    expect(wrapper.find(Loader).length).toEqual(0);
  });
  //點擊年月正確觸發回調
  it('click the year and month should trigger the selectNewMonth callback', () => {
    wrapper.find('.dropdown-toggle').simulate('click');
    wrapper.find('.months-range .dropdown-item').first().simulate('click');
    expect(actions.selectNewMonth).toHaveBeenCalledWith(
      initData.currentDate.year,
      1
    );
  });
  //點擊刪除正確觸發回調
  it('click the item delete button should trigger the deleteItem callback', () => {
    const firstItem = wrapper.find('.list-group .list-group-item').first();

    firstItem.find('.btn').last().simulate('click');
    testItems[0].category = {
      name: '娛樂',
      iconName: 'IosBeer',
      id: 6,
      type: 'outcome',
    };
    expect(actions.deleteData).toHaveBeenCalledWith(testItems[0]);
  });

  it('click the the tab should change the view and state', () => {
    wrapper.find('.nav-tabs .nav-link').at(1).simulate('click');
    expect(wrapper.find(LedgerList).length).toEqual(0);
    expect(wrapper.find(PieChart).length).toEqual(2);
    expect(
      wrapper.find('.nav-tabs .nav-link').at(1).hasClass('active')
    ).toEqual(true); //如果是Tabs自己有寫測試了
  });
});
