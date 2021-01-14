import React,{ useState, useMemo, useEffect, useContext } from 'react'
import { shallow, mount} from 'enzyme';
import { render,fireEvent,cleanup,waitFor } from '@testing-library/react';
import { BrowserRouter as Router, MemoryRouter, withRouter, Route } from 'react-router-dom';
import Create,{ CreatePage } from '../Create';
import { parseToYearsAndMonth, flattenArr, makeArrByRange} from '../../utility';
import Loader from '../../components/common/Loader';
import {Tabs} from '../../components/Tabs';
import CategorySelect from '../../components/CategorySelect';
import LedgerForm from '../../components/LedgerForm';
import { testCategories, testItems } from '../../testData';
import AppContext, { Provider } from '../../AppContext';
import { act } from 'react-dom/test-utils';
import { screen } from '@testing-library/react';

const testItem = testItems[1];
const match = {
  params:{
    id:"_jjfice21k"
  }
};
const createMatch = { params: { id: '' } }
const history = { push: () => {} }

const initActions = {
  // getEditData: jest.fn().mockReturnValue(Promise.resolve('')),
  getEditData: jest.fn().mockResolvedValue({}),
  createData: jest.fn().mockReturnValue(Promise.resolve('')),
  editData: jest.fn().mockReturnValue(Promise.resolve(''))
}

const actions = {
  getEditData: jest.fn().mockResolvedValue({ editItem: testItem, categories: flattenArr(testCategories)}),
  createData: jest.fn().mockReturnValue(Promise.resolve('')),
  editData: jest.fn().mockReturnValue(Promise.resolve(''))
}

const initData = {
  ledgerStore:{},
  categories: flattenArr(testCategories),//%% 要給否則category-item會空的
  isLoading:false,
  currentDate: parseToYearsAndMonth(),
  actions
  // actions:initActions
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

const fakeData = {
  categories: flattenArr(testCategories),
  editItem: testItem,
};

let wrapper;

describe('test Create component init behavior', () => {
  beforeEach(()=>{
  //   // expect.assertions(1);
  //   // jest.mock('./actions');
  //   // jest.mock('actions');
  //   // actions.getEditData.mockResolvedValue({editItem: testItem, categories: flattenArr(testCategories)});
  //   jest.spyOn(actions, 'getEditData').mockImplementation((id) =>Promise.resolve(fakeData));
  //   // actions.getEditData = jest.fn().mockResolvedValue({ editItem: testItem, categories: flattenArr(testCategories)})
  wrapper = mount(
      <AppContext.Provider value={initData}>
          <CreatePage match={createMatch} history={history} />
      </AppContext.Provider>
      )
  //   // await act(async () => {
  //   //   await Promise.resolve(wrapper);
  //   //   await new Promise(resolve => setTimeout(resolve, 0));
  //   //   // await new Promise(resolve => setImmediate(resolve));
  //   //   wrapper.update();
  //   // });

  })

  const setInputValue = (selector, newValue) => {
    wrapper.find(selector).instance().value = newValue
  }

  it('test Create page for the first render，getEditData should be called with right params',(done)=>{
      // console.log('Create.test.js match',match);
      // jest.mock('react-router-dom', () => ({
      //   ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
      //   useParams: () => ({
      //     id: '_jjfice21k',
      //   }),
      //   useRouteMatch: () => ({ url: '/company/company-id1/team/team-id1' }),
      // }));
      // jest.spyOn(match, 'params').mockReturnValue("_jjfice21k")
      // wrapper = mount(
      //   // <MemoryRouter initialEntries={["/create/id=_jjfice21k"]}>
      //     <AppContext.Provider value={initData}>
      //       {/* <Route path='/create'> */}
      //         <CreatePage match={match} history={history} />
      //       {/* </Route> */}
      //     </AppContext.Provider>
      //   // </MemoryRouter>
      // )
      // wrapper.setProps(match);
    // https://enzymejs.github.io/enzyme/docs/api/ReactWrapper/setProps.html

    setTimeout(()=>{
      console.log('准备expect');
    // setImmediate(()=>{
      // wrapper.update();
      // console.log(actions.getEditData);
      // console.log(actions.getEditData.mock);
      // expect(actions.getEditData.mock.calls.length).toBe(1);
      expect(actions.getEditData).toHaveBeenCalled();
      // expect(actions.getEditData).toHaveBeenCalledWith(testItem.id);
      // expect(actions.getEditData).toHaveBeenCalledWith('测试id');
      done();
    // })
    },0)
  })

  it('should show loading component when isLoading is true', () => {
    wrapper = mount(
      <AppContext.Provider value={loadingData}>
          <CreatePage match={createMatch} history={history} />
      </AppContext.Provider>
    )
    expect(wrapper.find(Loader).length).toEqual(1)
  })


});


describe('test component when in create mode', () => {
  // jest.setTimeout(20000);//超時的時間可在加上
  beforeEach(()=>{
    wrapper = mount(
      <AppContext.Provider value={initData}>
          <CreatePage match={createMatch} history={history} />
      </AppContext.Provider>
    )
  })
  const setInputValue = (selector, newValue) => {
    wrapper.find(selector).instance().value = newValue
  }

  it('should pass the null to props selectedCategory for CategorySelect', () => {
    expect(wrapper.find(CategorySelect).props().selectedCategory).toEqual(null)
  })

  it('should pass empty object for PriceForm', () => {
    expect(wrapper.find(LedgerForm).props().ledgerItem).toEqual({})
    expect(wrapper.find(Tabs).props().activeIndex).toEqual(0);
  })

  it('submit the form, the addItem should not be triggered', () => {
    wrapper.find('form').simulate('submit')
    expect(actions.createData).not.toHaveBeenCalled()
  })

  // it('fill all inputs, and select the category, submit the form, addItem should be called', (done) => {
  //   act(() => {
  //     // setInputValue('#inputTitle', 'new title')
  //     // setInputValue('#inputAmount', '200')
  //     // setInputValue('#inputDate', '2021-01-02')
  //     //%%%因為是取state的值 畫面上跟state不一樣
  //     wrapper.find('#inputTitle').simulate('change',{ target:{value:'new title'}});
  //     wrapper.find('#inputAmount').simulate('change',{ target:{value:'200'}});
  //     wrapper.find('#inputDate').simulate('change',{ target:{value:'2021-01-02'}});
  //     wrapper.find('.category-item').first().simulate('click')
  //   })
  //   setTimeout(() => {
  //     wrapper.update();
  //     console.log(wrapper.debug());
  //   // wrapper.find('form').simulate('submit')//%%已經preventDefault
  //     wrapper.find('#submit').simulate('click');
  //     setTimeout(() => {
  //       const testData = {title: 'new title', price: 200 , date: '2021-01-02'}
  //     // process.nextTick(() => {
  //       console.log(actions.createData.mock);
  //       expect(actions.createData).toHaveBeenCalledWith(testData, testCategories[0].id)
  //       done();//%%不能亂加
  //     },100)
  //   },1000)
  // })

  // jest.setTimeout(100000);
  it.only('改test-library測試', (done) => {
  // it('改test-library測試', async(done) => {// %%%%async不能隨便加上 會超時!!!!
    // beforeEach(cleanup)
    // expect.assertions(1);
    const { getByTestId, getByText, container, debug} = render(
      <AppContext.Provider value={initData}>
        <CreatePage match={createMatch} history={history} />
      </AppContext.Provider>
    );

    // await act(()=>{
      fireEvent.click(getByTestId('1'),{preventDefault:()=>{}});
      fireEvent.change(getByTestId("inputTitle"),{ target:{value:'new title'}});
      fireEvent.change(getByTestId("inputAmount"),{ target:{value:'200'}});
      fireEvent.change(getByTestId("inputDate"),{ target:{value:'2021-01-02'}});
      // console.log(container.querySelector('.category-item'));
      // fireEvent.click(container.querySelector('.category-item').first);//%%
      // console.log('====================================');
      // console.log(getByTestId('category-select').querySelector('.category-item').firstChild);
      // console.log('====================================');
      // // fireEvent.click(screen.getByText('旅行'));//%%
      // fireEvent.click(getByTestId('category-select').querySelector('.category-item').firstChild)
      // console.log('getget',getByTestId("inputAmount"));

    // })
    // setTimeout(()=>{
    // await waitFor(()=>{
      // container.update();
      // console.log(container.debug());
      debug()
      fireEvent.click(getByTestId("submit"));
      // expect(actions.createData.mock.calls).toHaveBeenCalledWith(testData, testCategories[0].id)
      // done()
      // },100)
    // })
    const testData = {title: 'new title', amount: 200 , date: '2021-01-02'}
    console.log(actions.createData.mock.calls);
    // done();
    // expect(actions.createData).toHaveBeenCalled();
    expect(actions.createData.mock.calls[0]).toEqual([testData,testCategories[0].id]);
    // expect(actions.createData.mock.calls[0][1]).toEqual(testCategories[0].id);
    done()//%%%這邊done要加
    cleanup();
  });

});

describe('test component when in edit mode', () => {
  beforeEach(async()=>{
    // jest.mock('actions');
    // actions.getEditData.mockResolvedValue({editItem: testItem, categories: flattenArr(testCategories)});
    // jest.mock('match')
    // match = { params:{ id:"_jjfice21k" }}
    wrapper = mount(
      // <Router>//%%%
        <AppContext.Provider value={withLoadedData}>
          <CreatePage match={match} history={history} />
        </AppContext.Provider>
      // </Router>
    )
  })

  const setInputValue = (selector, newValue) => {
    wrapper.find(selector).instance().value = newValue
  } //%%%

  const selectedCategory = testCategories.find(category => testItem.cid === category.id)

  it('should pass the right category to props selectedCategory for CategorySelect', (done) => {
    setTimeout(() => {
      wrapper.update()
      expect(wrapper.find(CategorySelect).props().selectedCategory).toEqual(selectedCategory)
      done()
    },100)
  })

  it('modify some inputs and submit the form, modifyItem should be called', () => {
    // setInputValue('#title', 'new title')
    wrapper.find('#inputTitle').simulate('change',{ target:{value:'new title'}});
    wrapper.update();
    setTimeout(() => {
      wrapper.find('#submit').simulate('click');
      const testData = {...testItem, title: 'new title'}
      expect(actions.editData).toHaveBeenCalledWith(testData, selectedCategory.id)
    },0)
  })
})
