// import { render, screen } from '@testing-library/react';
// import App from './App';

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

import React from 'react'
import { testCategories, testItems } from './testData'
import { mount } from 'enzyme'
import { render,fireEvent,cleanup,waitFor } from '@testing-library/react';
import { toBeInTheDocument } from '@testing-library/jest-dom';
import App,{actions} from './App'
import { BrowserRouter as Router, MemoryRouter, withRouter, Route } from 'react-router-dom';
import { flattenArr, parseToYearsAndMonth, makeID } from './utility';
import AppContext from './AppContext';
import { CreatePage } from './containers/Create';
import CreateBtn from './components/CreateBtn';
import LedgerForm from './components/LedgerForm';


// import mockAxios from './__mocks__/axios'
import api from './api';
import { act } from 'react-dom/test-utils';

jest.mock('./api');
const testItem = testItems[1];
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
  actions
  // actions:initActions
}

// https://github.com/facebook/jest/issues/2157#issuecomment-279171856
// const waitForAsync = () => new Promise(resolve => setImmediate(resolve))
describe('test App component init behavior', () => {

  afterEach(() => {
    jest.clearAllMocks()

  })
  afterEach(cleanup)
  beforeEach(() => {

    // api.get.mockImplementation(jest.fn((url) => { //無效
    api.get = jest.fn().mockImplementation(jest.fn((url) => {
      console.log("log output from mock axios!!!!!!!!!");
      if (url.indexOf('category') > -1) {
          return Promise.resolve({
              data: testCategories
        });
      }
      if (url.indexOf('ledger?') > -1) {
          return Promise.resolve({
              data: testItems
          });
      }
      if (url.indexOf('ledger/') > -1 ) {
        return Promise.resolve({
          data: {
              ...testItems[2],
              // id: 'testId'
          }
        });
      }
    }));
    api.post = jest.fn().mockImplementation((url)=>{
      // return Promise.resolve({ data: {...testItems[0], id: 'new_created_id'}})
      //~返回不需要拿id
      return Promise.resolve({ data: {...testItems[0]}})
    })
    api.put = jest.fn().mockImplementation((url, updateObj)=>{
      //尋找testItems陣列原本id的item
      const modifiedItem = testItems.find((item) => item.id === updateObj.id)
      return Promise.resolve({ data: { ...modifiedItem, ...updateObj }})//返回覆蓋過後的
    });
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
  // it.only('test getEditData with initial data in create mode', async() => {
  //   // const wrapper = mount(<App/>)
  //   const {getByTestId,debug} = render(<App/>)
  //   // await act(async()=>{
  //   //   await wrapper.instance().actions.getEditData()//@@
  //   // // })
  //   // console.log(wrapper.debug());
  //   debug()
  //   await waitFor(() => { //!!!!需要不然會處在加載中找不到按鈕
  //     fireEvent.click(getByTestId('createBtn'));
  //   })
  //   // wrapper.find(CreateBtn).simulate('click');
  //   expect(api.get).toHaveBeenCalledTimes(2)
  // })

  //沒有加載過資料，直接到達創建頁新建 =>api get會呼叫三次 ，一開始mount兩次清空後getEditData 創建再一次
  it('test getEditData without initial data in create mode', () => {
    // jest.mock('react-router-dom',()=>({
    //   ...jest.requireActual('react-router-dom'),
    //   Route:MemoryRouter
    // }))
    // jest.spyOn('react-router-dom','Route')
    // jest.mock('react-router-dom')
    const wrapper = mount(
      <AppContext.Provider value={initData}>
          <CreatePage match={createMatch} history={history} />
      </AppContext.Provider>
      // <App/>
    )
    // await waitForAsync()
      // console.log(wrapper.debug());

    // const actions = wrapper.find()
    // wrapper.setState({
    //   categories: {},
    //   items: {},
    // })
    // await act(async()=>{
    //   await wrapper.instance().actions.getEditData()
    // })
    expect(api.get).toHaveBeenCalledTimes(1)
    // expect(api.get).toHaveBeenLastCalledWith('/category')
  })

// -----
  //首頁加載後，創建頁做編輯 ，api一樣只get兩次(items、categories) edit mode不會再發請求
  it('test getEditData with initial data in edit mode', async () => {
    // const wrapper = mount(<App/>)
    const { getByTestId,debug } = render(<App/>)
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
    expect(api.get).toHaveBeenCalledTimes(2)
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
  it.only('test createItem with initial data', (done) => {
    const wrapper = mount(<App/>)
    // await waitForAsync()
    // await act(async()=>{
    //   await wrapper.instance().actions.createData({}, 2)
    // })
    process.nextTick(()=>{
      // act(()=>{
        wrapper.update();
        // console.log(wrapper.debug());
        wrapper.find(CreateBtn).simulate('click');
        wrapper.find('.category-item').first().simulate('click');
        console.log(wrapper.debug());
        wrapper.find(LedgerForm).invoke('onFormSubmit')({}, false);
        setTimeout(()=>{
          expect(api.post).toHaveBeenCalledTimes(1)
        },100)
        // done()
      // })
    },100)
    // setTimeout(()=>{
    //   wrapper.update();
    //
    //   done()
    // },100)
    // const currentState = wrapper.instance().state
    // expect(Object.keys(currentState.items).length).toEqual(testItems.length + 1)

  })
  //加載後 更新item
  //觸發app create => put被觸發一次，新顯示的item是對的
  it('test updateItem with initial data', async() => {
    const wrapper = mount(<App/>)
    // await waitForAsync()
    // const singleItem = testItems.find((item) => item.id === '_1fg1wme63')
    //~拿testItem的第三項
    const singleItem = testItems[2];//id為_1fg1wme63
    const modifiedItem = { ...singleItem, title: 'updated title' }
    await act(async()=>{
      await wrapper.instance().actions.editData(modifiedItem, 2)
    })
    wrapper.update();
    expect(api.put).toHaveBeenCalledTimes(1)
    // -------------------------------------
    const currentState = wrapper.instance().state
    const newItem = currentState.items['_1fg1wme63']
    expect(newItem.title).toEqual('updated title')
  })
  //加載後 刪除item
  //觸發app的delete => api delete會呼叫一次，顯示的長度會比test資料少一個
  it('test deleteItem with initial data', async() => {
    const wrapper = mount(<App/>)
    // await waitForAsync()
    await act(async()=>{
      // await wrapper.instance().actions.deleteItem({ id: '_1fg1wme63'})//@@如何觸發內部函數
      await wrapper.getDOMNode().actions.deleteData({ id: '_1fg1wme63'})//@@如何觸發內部函數
    })
    //~dispatchLedger運行 重新setState
    wrapper.update();
    expect(api.delete).toHaveBeenCalledTimes(1)
    const currentState = wrapper.instance().state
    expect(Object.keys(currentState.items).length).toEqual(testItems.length - 1)
    // expect(wrapper.find(".ledger-item").length).toEqual(testItems.length - 1);
    const deletedItem = currentState.items['_1fg1wme63']
    expect(deletedItem).toBeUndefined()
    // expect(wrapper.find('.').length).toBe(0);
  })
})
