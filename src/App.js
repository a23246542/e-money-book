import { useState, createContext, useReducer, useRef, useEffect, component, Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Home from './containers/Home';
import Create from './containers/Create';
import { testCategories, testItems } from './testData';
import { Provider } from './AppContext';
import { flattenArr, parseToYearsAndMonth, makeID } from './utility';
import api from './api';
// import axios from 'axios';

// let actions;

function App() {
// class App extends Component {

  // const state = {//%%!!用這個state reducer不會更新後
  //   // ledgerItems: flattenArr(testItems),
  //   // categories: flattenArr(testCategories),
  //   ledgerItems: {},
  //   categories: {},
  //   currentDate: parseToYearsAndMonth(),
  // }
  // const node = useRef(null);

  // const [ state, setState ] = useState({
  //   ledgerItems: {},
  //   categories: {},
  //   currentDate: parseToYearsAndMonth(),
  // })

  // const [ ledgerItems, setLedgerItems ] = useState({})
  const [ categories, setCategories] = useState({})
  const [ currentDate, setCurrentDate ] = useState(()=>parseToYearsAndMonth());//@@保留
  const [ isLoading, setIsLoading ] = useState(false);

  const withLoader = (cb) => {
    return (...args) => {
      setIsLoading(true);
      return cb(...args)
      // .then(() => { setIsLoading(false);});//%%會取代掉後來加上的
    }
  }

  const actions = {
    getInitData: withLoader(async () => {
      console.log('觸發getInitData');
      // const getUrlWithData = `/ledger/monthCategory=${currentDate.year}-${currentDate.month}&_sort=timestamp&_order=desc`;
      const getUrlWithData = `/ledger?monthCategory=${currentDate.year}-${currentDate.month}&_sort=timestamp&_order=desc`;
      const promiseArr = [api.get('/category'),api.get(getUrlWithData)];
      const resultArr = await Promise.all(promiseArr);//@@改then試同步?
      // const [ resLedger,resCategory ] = resultArr;//%%%順序
      const [ resCategory, resLedger ] = resultArr;
      // setLedgerItems(flattenArr(resLedger.data));//%%@@
      console.log('resLedger.data',flattenArr(resLedger.data));
      dispatchLedger({
        type:'fetchItems',
        payload:flattenArr(resLedger.data)
      })
      setCategories(flattenArr(resCategory.data));
      setIsLoading(false);
    }),
    selectNewMonth: withLoader(async (year, month) => {
      const getUrlWithData = `/ledger?monthCategory=${year}-${month}&_sort=timestamp&_order=desc`;
      const res = await api.get(getUrlWithData);
      dispatchLedger({
        type:'fetchItems',
        payload: flattenArr(res.data),
      })
      setCurrentDate({
        year, month
      })
      setIsLoading(false);
      // return res;//返不返回都可以
    }),
    getEditData: withLoader(async (id) => { //創建頁重整可取得編輯資料
      let promiseArr= [];
      // console.log('getEditData.js的ledgerStore',ledgerStore);
      if (Object.keys(categories).length===0) {
        promiseArr.push(api.get('/category'))
      } else {
        promiseArr.push(new Promise((resolve)=>resolve(null)))
      }

      const isItemAlreadyFetched = !!(Object.keys(ledgerStore).indexOf(id) > -1)

      if(id && !isItemAlreadyFetched) {
        const getUrlWithId = `/ledger/${id}`;
        promiseArr.push(api.get(getUrlWithId));
      }
      const [ resCategory, resEditItem ] = await Promise.all(promiseArr);
      // console.log('會是undefined',resCategory,resEditItem);
      console.log('getEditData.js',`/ledger/${id}`,resEditItem);

      const finalCategory = resCategory ? flattenArr(resCategory.data) : categories;
      const finalEditItem = resEditItem ? resEditItem.data : ledgerStore[id];


      if(id) {
        // setCategories(flattenArr(resCategory.data));
        setCategories(finalCategory);
        setIsLoading(false);
        dispatchLedger({
          type:'fetchItems',
          // payload:resEditItem%%
          payload:{
            // [id]:resEditItem.data
            [id]:finalEditItem
          }
        })
      } else {
        setCategories(finalCategory);
        setIsLoading(false);
      }
      console.log('有id set資料');

      return {
        categories: finalCategory,
        editItem: finalEditItem,
      }
    }),
    createData: withLoader(async (formData,selectedCategoryId) => {
      const newId = makeID();
      const dateObj = parseToYearsAndMonth(formData.date);
      const timestamp = new Date().getTime();
      // const { data:newItem } = await api.post('/ledger',{
      // const newItem  = await api.post('/ledger',{ //@@會自動解構data
      const { data:newItem }  = await api.post('/ledger',{ //%%%不會自動解構data
        ...formData,
        id:newId,
        cid:selectedCategoryId,
        monthCategory: `${dateObj.year}-${dateObj.month}`,
        timestamp
      });
      console.log('createData的newItem',newItem);
      dispatchLedger({
        type: 'addItem',
        payload: {
          newItem,
          newId
        },
      })
      return newItem;
    }),
    editData: withLoader(async(formData, updatedCategoryId) => {
      const dateObj = parseToYearsAndMonth(formData.date);
      const timestamp = new Date(formData.date).getTime();//@年月日轉排序
      const updatedItem = {
        ...formData,
        cid: updatedCategoryId,
        // timestamp,//%%會不小心把排序提升 創建有就好
        monthCategory: `${dateObj.year}-${dateObj.month}`,
      }
      const { data:modifiedItem } = await api.put(`ledger/${formData.id}`,updatedItem)
      // const modifiedItem  = await api.put(`ledger/${formData.id}`,updatedItem)
      dispatchLedger({
        type: 'updateItem2',
        payload:{
          id:modifiedItem.id,
          modifiedItem
        }
      })
      console.log('update title的',modifiedItem);
      return modifiedItem;
    }),
    deleteData: withLoader(async (item) => {
      await api.delete(`/ledger/${item.id}`).then(() =>{
        console.log('順序1');
        dispatchLedger({
          type:'deleteItem',
          payload: item
        });
        setIsLoading(false);
      })
      console.log('順序2');
    }),
  }

  // useEffect(()=>{ //%%%
  //   action.getInitData();
  // },[])

  const ledgerReducer = (state,action) => {
    const { type, payload } = action
    let dateObj = {}, timestamp = 0;//%%
    // const { formData } = payload;
    switch (type) {
      case 'fetchItems': {
        return payload;
      }
      case 'deleteItem':{
        const { id } = payload;
        // delete state[payload.id];
        // let clone = {...ledgerItems};//@@ ReferenceError: Cannot access 'ledgerItems' before initialization
        let clone = { ...state }
        delete clone[id];
        return clone;
      }
      case 'createItem':{
        const { selectedCategoryId, formData } = payload;
        // console.log(formData,selectedCategoryId);
        dateObj = parseToYearsAndMonth(formData.date);
        timestamp = new Date().getTime();
        const newId = makeID();
        const newItem = {
          ...formData,
          id: newId,
          cid: selectedCategoryId,
          monthCategory: `${dateObj.year}-${dateObj.month}`,
          timestamp
        }
        // console.log({...state, [newId]: newItem});
        // return {...state, newId: newItem};//%%%属性沒辦法直接存取變數會變字串
        return {...state, [newId]: newItem};
      }
      case 'addItem':{
        const { newItem, newId } = payload;
        return { ...state, [newId]: newItem}
      }
      case 'updateItem':{
        // const { id, formData1, updatedCategoryId} = payload;//%%% const會重複
        // const dateObj = parseToYearsAndMonth(formData1.date);
        const { updatedCategoryId, formData } = payload;
        dateObj = parseToYearsAndMonth(formData.date);
        timestamp = new Date(formData.date).getTime();//@年月日轉排序
        const modifiedItem = {
          // ...state[id],//%%ledgerForm已經帶上id等等
          ...formData,
          cid: updatedCategoryId,
          // timestamp,//%%會不小心把排序提升
          monthCategory: `${dateObj.year}-${dateObj.month}`,
        }
        // return {...state, state[id]: updatedItem}/ %%用modifiedItem
        // return {...state, modifiedItem[id]: modifiedItem} %% 屬性 Failed to compile Unexpected token, expected ","
        return {...state, [modifiedItem.id]: modifiedItem};
      }
      case 'updatedItem2':{
        const { id, modifiedItem } = payload;
        return {...state, [id]: modifiedItem};
      }
      default:
        return state;
    }

  }

  // const [ ledgerStore, dispatchLedger ] = useReducer(ledgerReducer,ledgerItems)
  const [ ledgerStore, dispatchLedger ] = useReducer(ledgerReducer,{})

  return (
    <Provider value={{
      categories:categories,
      ledgerStore,
      dispatchLedger,//~~因為在父層做幾乎不用 資料狀態在父層改變傳下去就好
      currentDate,
      isLoading,
      actions,
      // node
    }}>
      <Router>
        <ul>
          <Link to="/">首頁</Link>
          <Link to="/create">新增編輯</Link>
        </ul>
        <div className="App">
          {/* <Home/> */}
          <Route path="/" exact component={Home}/>
          <Route path="/create" component={Create} />
          {/* %%%會同時出現 */}
          {/* <Route path="/create/:id"  render={()=><p>編輯頁</p>} /> */}
          <Route path="/edit/:id" component={Create}/>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
// export {actions};

