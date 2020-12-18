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

    switch (type) {
      case 'deleteItem':
        // delete state[payload.id];
        // let clone = {...ledgerItems};//@@ ReferenceError: Cannot access 'ledgerItems' before initialization
        let clone = { ...state }
        delete clone[payload.id];
        return clone;
      case 'createItem':
        const { formData, selectedCategoryId } = payload;
        // console.log(formData,selectedCategoryId);
        const dateObj = parseToYearsAndMonth(formData.date);
        const timestamp = new Date().getTime();
        const newId = makeID();
        const newItem = {
          ...formData,
          id: newId,
          cid: selectedCategoryId,
          monthCategory: `${dateObj.year}-${dateObj.month}`,
          timestamp
        }
        console.log({...state, newId: newItem});
        // return {...state, newId: newItem};//%%%属性沒辦法直接存取變數會變字串
        return {...state, [newId]: newItem};
      default:
        return state;
    }

  }

  const [ ledgerItems, dispatchLedger ] = useReducer(ledgerReducer,defaultState.ledgerItems)

  return (
    <Provider value={{
      categories:defaultState.categories,
      ledgerItems,
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
