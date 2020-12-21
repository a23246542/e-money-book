import { useState, createContext, useReducer, useRef } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Home from './containers/Home';
import Create from './containers/Create';
import { testCategories, testItems } from './testData';
import { Provider } from './AppContext';
import { flattenArr, parseToYearsAndMonth, makeID } from './utility';


function App() {

  const defaultState = {
    ledgerItems: flattenArr(testItems),
    categories: flattenArr(testCategories),
  }
  // const node = useRef(null);

  const ledgerReducer = (state,action) => {
    const { type, payload } = action
    let dateObj, timestamp;//%%
    const { formData } = payload;
    switch (type) {
      case 'deleteItem':
        // delete state[payload.id];
        // let clone = {...ledgerItems};//@@ ReferenceError: Cannot access 'ledgerItems' before initialization
        let clone = { ...state }
        delete clone[payload.id];
        return clone;
      case 'createItem':
        const { selectedCategoryId } = payload;
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
      case 'updateItem':
        // const { id, formData1, updatedCategoryId} = payload;//%%% const會重複
        // const dateObj = parseToYearsAndMonth(formData1.date);
        const { updatedCategoryId } = payload;
        dateObj = parseToYearsAndMonth(formData.date);
        timestamp = new Date(formData.date).getTime();
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
      default:
        return state;
    }

  }

  const [ ledgerStore, dispatchLedger ] = useReducer(ledgerReducer,defaultState.ledgerItems)

  return (
    <Provider value={{
      categories:defaultState.categories,
      ledgerStore,
      dispatchLedger,
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
