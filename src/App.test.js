// import { render, screen } from '@testing-library/react';
// import App from './App';

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

import React from 'react'
import { testCategories, testItems, testItemsCopy } from './testData'
import { mount } from 'enzyme'
import { render,fireEvent,cleanup,waitFor } from '@testing-library/react';
import { toBeInTheDocument } from '@testing-library/jest-dom';
import App,{actions} from './App'
import { BrowserRouter as Router, MemoryRouter, withRouter, Route,
  // createHistory,
  // createMemorySource,
  // LocationProvider,
} from 'react-router-dom';
import { flattenArr, parseToYearsAndMonth, makeID } from './utility';
import AppContext from './AppContext';
import { CreatePage } from './containers/Create';
import CreateBtn from './components/CreateBtn';
import LedgerForm from './components/LedgerForm';
import LedgerList from './components/LedgerList';
import { createMemoryHistory } from "history";
import {
  createHistory,
  createMemorySource,
  LocationProvider,
} from '@reach/router'



// import mockAxios from './__mocks__/axios'
import api from './api';
import { act } from 'react-dom/test-utils';

// jest.mock('./api');
const testItem = JSON.parse(JSON.stringify(testItems[1]));
const match = {
  params:{
    id:"_jjfice21k"
  }
};
const createMatch = { params: { id: '' } }
const history = { push: () => {} }

// const actions = {
//   getEditData: jest.fn().mockResolvedValue({ editItem: undefined, categories: flattenArr(testCategories)}),
//   createData: jest.fn().mockReturnValue(Promise.resolve('')),
//   editData: jest.fn().mockReturnValue(Promise.resolve(''))
// }

const initData = {
  ledgerStore:{},
  categories: {},//%% 要給否則category-item會空的
  isLoading:false,
  currentDate: parseToYearsAndMonth(),
  // actions
  // actions:initActions
}

// https://github.com/facebook/jest/issues/2157#issuecomment-279171856
// const waitForAsync = () => new Promise(resolve => setImmediate(resolve))
describe('test App component init behavior', () => {
  let wrapper;

  afterEach(() => {
    jest.clearAllMocks()
    // wrapper.unmount()
  })
  afterEach(cleanup)
  beforeEach(() => {
    // api.get.mockImplementation(jest.fn((url) => { //無效
    // api.get = jest.fn().mockImplementation(jest.fn((url) => {
    //   console.log("log output from mock axios!!!!!!!!!");
    //   if (url.indexOf('category') > -1) {
    //       return Promise.resolve({
    //           data: testCategories
    //     });
    //   }
    //   if (url.indexOf('ledger?') > -1) {
    //       return Promise.resolve({
    //           // data: testItems
    //           data: testItems
    //       });
    //   }
    //   if (url.indexOf('ledger/') > -1 ) {
    //     return Promise.resolve({
    //       data: {
    //           ...testItems[2],
    //           // id: 'testId'
    //       }
    //     });
    //   }
    // }));
    api.post = jest.fn().mockImplementation((url)=>{
      // return Promise.resolve({ data: {...testItems[0], id: 'new_created_id'}})
      //~返回不需要拿id
      return Promise.resolve({ data: {...testItems[0]}})
    })
    // api.put = jest.fn().mockImplementation((url, updateObj)=>{
    //   //尋找testItems陣列原本id的item
    //   const modifiedItem = testItems.find((item) => item.id === updateObj.id)
    //   return Promise.resolve({ data: { ...modifiedItem, ...updateObj }})//返回覆蓋過後的
    // });
    api.delete = jest.fn().mockImplementation((url)=>{
      // const id = url.match(/\w+/g)[1]
      // const filteredItem = testItems.find((item) => item.id === id)
      // return Promise.resolve({ data: filteredItem })
      return Promise.resolve();//這邊不需要用到回傳資料
    });
  })


  //app home加載過後 => app的state資料長度等於test資料長度
  it('check App Home state with initial action', () => {
    const wrapper = mount(<App/>)
    expect(api.get).toHaveBeenCalledTimes(2)
    // await waitForAsync()
    // const currentState = wrapper.instance().state
    // expect(Object.keys(currentState.items).length).toEqual(testItems.length)
    // expect(Object.keys(currentState.categories).length).toEqual(testCategories.length)
  })
// ----
  //首頁加載過資料後 到創建頁呼叫getEditData => 不會再發新api.get，只有mount的兩次
  it('test getEditData with initial data in create mode', async() => {
    // const wrapper = mount(<App/>)
    const {getByTestId,debug} = render(<App/>)
    // await act(async()=>{
    //   await wrapper.instance().actions.getEditData()//@@
    // // })
    // console.log(wrapper.debug());
    // debug()
    await waitFor(() => { //!!!!需要不然會處在加載中找不到按鈕
      fireEvent.click(getByTestId('createBtn'));
    })
    // wrapper.find(CreateBtn).simulate('click');
    expect(api.get).toHaveBeenCalledTimes(2)
    fireEvent.click(getByTestId('cancel'));//不按回去下一頁的url會不對
  })

  //@@問題
  //沒有加載過資料，直接到達創建頁新建 =>api get會呼叫三次 ，一開始mount兩次清空後getEditData 創建再一次
  it('test getEditData without initial data in create mode', () => {
    // jest.mock('react-router-dom',()=>({
    //   ...jest.requireActual('react-router-dom'),
    //   Route:MemoryRouter
    // }))
    // jest.spyOn('react-router-dom','Route')
    // jest.mock('react-router-dom')
    // const wrapper = mount(
    //   <AppContext.Provider value={initData}>
    //       <CreatePage match={createMatch} history={history} />
    //   </AppContext.Provider>
    //   // <App/>
    // )

    // function renderWithRouter(
    //   ui,
    //   { route = '/', history = createHistory(createMemorySource(route)) } = {}
    // ) {
    //   return {
    //     ...render(<LocationProvider history={history}>{ui}</LocationProvider>),
    //     // adding `history` to the returned utilities to allow us
    //     // to reference it in our tests (just try to avoid using
    //     // this to test implementation details).
    //     history,
    //   }
    // }

    const renderWithRouter = (ui, { route = '/' } = {}) => {
      window.history.pushState({}, 'Test page', route)

      // return render(ui, { wrapper: BrowserRouter })
      return render(ui, { wrapper: MemoryRouter })
    }

    const { container, debug,getByTestId } = renderWithRouter(<App />, {
      route: '/create',
    })


    // wrapper.setState({
    //   categories: {},
    //   items: {},
    // })
    // await act(async()=>{
    //   await wrapper.instance().actions.getEditData()
    // })
    // expect(container.innerHTML).toMatch('取消');
    expect(api.get).toHaveBeenCalledTimes(1);
    fireEvent.click(getByTestId('cancel'));
    debug();
    // expect(api.get).toHaveBeenLastCalledWith('/category')
  })

// -----
  //首頁加載後，創建頁做編輯 ，api一樣只get兩次(items、categories) edit mode不會再發請求
  it('test getEditData with initial data in edit mode', async () => {
    // const wrapper = mount(<App/>)
    const { getByTestId,debug,unmount } = render(<App/>)
    // await act(async()=>{
      //   await wrapper.instance().actions.getEditData('_1fg1wme63')
      // })
      await waitFor(()=>{
        // fireEvent.click(getByTestId('ledger-item-_bd16bjeen').getByText('編輯'));
        fireEvent.click(getByTestId('editBtn-_bd16bjeen'));
      })
      await waitFor(()=>{
        // debug();
        expect(getByTestId('submit')).toBeInTheDocument();
      })
      expect(api.get).toHaveBeenCalledTimes(2);
      fireEvent.click(getByTestId('cancel'));//不按回去下一頁的url會不對
      // debug();
  })

  //首頁沒有加載，創建頁不会做編輯
  //@@好像有問題
  // it('test getEditData with initial data in edit mode with new data', async () => {
  //   const wrapper = mount(<App/>)
  //   // await waitForAsync()
  //   // await wrapper.instance().actions.getEditData('new_temp_id')
  //   expect(api.get).toHaveBeenCalledTimes(3)
  //   const currentState = wrapper.instance().state
  //   expect(currentState.items).toHaveProperty('new_temp_id')
  //   expect(Object.keys(currentState.items).length).toEqual(testItems.length + 1)
  // })
// ---------
  //觸發app create =>post被觸發一次，之後items增加一個
  it('test createItem with initial data', (done) => {
    // --------------------重置url無效-----------------------
    const history = createMemoryHistory();
    console.log('historyhistory',history.location);
    window.location.reload();
    history.go(0);
    // -------------------------------------------
    wrapper = mount(<App/>)
    // await waitForAsync()
    // await act(async()=>{
      //   await wrapper.instance().actions.createData({}, 2)
      // })
      // console.log('testItems11111111111',testItems);
      process.nextTick(()=>{
        // act(()=>{
          wrapper.update();
          console.log('test createItem with initial data',wrapper.debug());
        wrapper.find(CreateBtn).simulate('click');
        wrapper.find('.category-item').first().simulate('click');
      //   // console.log(wrapper.debug());
        wrapper.find(LedgerForm).invoke('onFormSubmit')({
          title:'new title', amount:300, date:'2021-01-01'
        }, false);
        setTimeout(()=>{
          expect(api.post).toHaveBeenCalledTimes(1);
          done();
        },100)
        // done()
      // })
    })
    // setTimeout(()=>{
    //   wrapper.update();
    //
    //   done()
    // },100)
    // const currentState = wrapper.instance().state
    // expect(Object.keys(currentState.items).length).toEqual(testItems.length + 1)

  })
  //加載後 更新item
  // 觸發app create => put被觸發一次，新顯示的item是對的
  it.only('test updateItem with initial data', (done) => {
    jest.clearAllMocks();
    const wrapper = mount(<App/>)

    // const singleItem = testItems.find((item) => item.id === '_1fg1wme63')
    //~直接拿testItem的第三項
    // const singleItem = testItems[0];//id為__bd16bjeen
    const singleItem = {
      "title": "超市购物",
      "amount": 1250,
      "date": "2021-01-04",
      "monthCategory": "2021-1",
      "timestamp": 1543881600000,
      "id": "_j0z9no9jk",
      "cid": "3"
    }
    const modifiedItem = { ...singleItem, title: 'updated title' }
    // await act(async()=>{
      //   await wrapper.instance().actions.editData(modifiedItem, 2)
      // })


      // setImmediate(()=>{
        // ReactWrapper::context() can only be called on components with instances
        // console.log('測試context',wrapper.context().ledgerStore);

        // const waitForAsync = () => new Promise(resolve=>setImmediate(resolve))
        // await waitForAsync();
        // process.nextTick(()=>{
        setTimeout(()=>{ //@@多加這一層才取得...異不數據 //!!實測效果比setImmediate process.nextTick好
              wrapper.update();
              // console.log(wrapper.debug());

              wrapper.find('[data-testid="editBtn-_j0z9no9jk"]').simulate('click');
              act(()=>{
                wrapper.find(LedgerForm).invoke('onFormSubmit')(modifiedItem,true)
              })
              // process.nextTick(()=>{
                // expect(api.put).toHaveBeenCalledTimes(1)
                // -------------------------------------
                // const currentState = wrapper.instance().state
                // const newItem = currentState.items['_1fg1wme63']

                setTimeout(()=>{ //%%debug看有差
                  console.log('====================================');
                  // console.log('條目的props',wrapper.find(LedgerList).prop('items'));//%%這時抓不到
                  wrapper.update();//%%常忘記
                  console.log(wrapper.debug());
                  console.log('條目的props',wrapper.find(LedgerList).prop('items'));
                  const newItemTitle = wrapper.find('.ledger-item').at(1).children('.ledger-title').text();
                  expect(newItemTitle).toEqual('updated title')
                  // console.log(wrapper.debug());
                  // console.log(wrapper.find('.ledger-title').first().text());
                  console.log('====================================');
                  console.log('--集成測試難點 mock假api 沒辦法確認首頁dom是對的--');
                  //下面測試無效 只能測測看context變化

                  done()
                },1000)
              // })
        },100)
        // })
    // })
  })
  //加載後 刪除item
  //觸發app的delete => api delete會呼叫一次，顯示的長度會比test資料少一個
  // it('test deleteItem with initial data', async() => {
  //   const wrapper = mount(<App/>)
  //   // await waitForAsync()
  //   await act(async()=>{
  //     // await wrapper.instance().actions.deleteItem({ id: '_1fg1wme63'})//@@如何觸發內部函數
  //     await wrapper.getDOMNode().actions.deleteData({ id: '_1fg1wme63'})//@@如何觸發內部函數
  //   })
  //   //~dispatchLedger運行 重新setState
  //   wrapper.update();
  //   expect(api.delete).toHaveBeenCalledTimes(1)
  //   const currentState = wrapper.instance().state
  //   expect(Object.keys(currentState.items).length).toEqual(testItems.length - 1)
  //   // expect(wrapper.find(".ledger-item").length).toEqual(testItems.length - 1);
  //   const deletedItem = currentState.items['_1fg1wme63']
  //   expect(deletedItem).toBeUndefined()
  //   // expect(wrapper.find('.').length).toBe(0);
  // })
})
