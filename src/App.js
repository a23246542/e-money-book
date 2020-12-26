import { useState, createContext, useReducer, useRef, useEffect } from 'react';
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


function App() {

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

  const actions = {
    getInitData: async () => {
      setIsLoading(true);
      // const getUrlWithData = `/ledger/monthCategory=${currentDate.year}-${currentDate.month}&_sort=timestamp&_order=desc`;
      const getUrlWithData = `/ledger?monthCategory=${currentDate.year}-${currentDate.month}&_sort=timestamp&_order=desc`;
      const promiseArr = [api.get('/category'),api.get(getUrlWithData)];
      const resultArr = await Promise.all(promiseArr);//@@改then試同步?
      // const [ resLedger,resCategory ] = resultArr;//%%%順序
      const [ resCategory, resLedger ] = resultArr;
      // setLedgerItems(flattenArr(resLedger.data));//%%@@
      dispatchLedger({
        type:'initialItem',
        payload:flattenArr(resLedger.data)
      })
      setCategories(flattenArr(resCategory.data));
      setIsLoading(false);
    },
    selectNewMonth: async (year, month) => {
      setIsLoading(true);
      const getUrlWithData = `/ledger?monthCategory=${year}-${month}&_sort=timestamp&_order=desc`;
      const res = await api.get(getUrlWithData);
      dispatchLedger({
        type:'initialItem',
        payload: flattenArr(res.data),
      })
      setCurrentDate({
        year, month
      })
      setIsLoading(false);
    },
    deleteData: async (item) => {
      setIsLoading(true);
      await api.delete(`/ledger/${item.id}`).then(() =>{
        console.log('順序1');
        dispatchLedger({
          type:'deleteItem',
          payload: item
        });
        setIsLoading(false);
      })
      console.log('順序2');
    }
  }

  // useEffect(()=>{ //%%%
  //   action.getInitData();
  // },[])

  const ledgerReducer = (state,action) => {
    const { type, payload } = action
    let dateObj = {}, timestamp = 0;//%%
    // const { formData } = payload;
    switch (type) {
      case 'initialItem': {

        return payload;
      }
      case 'deleteItem':{
        // delete state[payload.id];
        // let clone = {...ledgerItems};//@@ ReferenceError: Cannot access 'ledgerItems' before initialization
        let clone = { ...state }
        delete clone[payload.id];
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
        console.log({...state, [newId]: newItem});
        // return {...state, newId: newItem};//%%%属性沒辦法直接存取變數會變字串
        return {...state, [newId]: newItem};
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
          timestamp,
          monthCategory: `${dateObj.year}-${dateObj.month}`,
        }
        // return {...state, state[id]: updatedItem}/ %%用modifiedItem
        // return {...state, modifiedItem[id]: modifiedItem} %% 屬性 Failed to compile Unexpected token, expected ","
        return {...state, [modifiedItem.id]: modifiedItem};
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
      // dispatchLedger,//~~因為在父層做幾乎不用 資料狀態在父層改變傳下去就好
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
