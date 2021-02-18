import { useState, useReducer, useRef } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  useRouteMatch,
} from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Home from './containers/Home';
import Create from './containers/Create';
import Login from './containers/Login';
import AppContext from './AppContext';
import AuthContext from './contexts/AuthContext';
import { flattenArr, parseToYearsAndMonth, makeID } from './utility';
import useFacebookLogin from './hooks/useFacebookLogin';
import useLedger from './hooks/useLedger';
import api from './api';

function App() {
  const [categories, setCategories] = useState({});
  const [currentDate, setCurrentDate] = useState(() => parseToYearsAndMonth());
  const [isLoading, setIsLoading] = useState(false);

  // const [fbResponse, handleFBLogin, handleFBLogout] = useFacebookLogin({
  //   appId: process.env.REACT_APP_FB_APP_ID,
  //   cookie: true,
  //   xfbml: true,
  //   version: process.env.REACT_APP_FB_APP_VERSION,
  // });

  const { ledgerStore, dispatchLedger } = useLedger();

  const withLoader = (cb) => {
    return (...args) => {
      setIsLoading(true);
      return cb(...args);
    };
  };

  const actions = {
    getInitData: withLoader(async () => {
      const getUrlWithData = `/ledger?monthCategory=${currentDate.year}-${currentDate.month}&_sort=timestamp&_order=desc`;
      const promiseArr = [api.get('/category'), api.get(getUrlWithData)];
      const [resCategory, resLedger] = await Promise.all(promiseArr);

      dispatchLedger({
        type: 'fetchItems',
        payload: flattenArr(resLedger.data),
      });
      setCategories(flattenArr(resCategory.data));
      setIsLoading(false);
    }),
    selectNewMonth: withLoader(async (year, month) => {
      const getUrlWithData = `/ledger?monthCategory=${year}-${month}&_sort=timestamp&_order=desc`;
      const resLedger = await api.get(getUrlWithData);

      dispatchLedger({
        type: 'fetchItems',
        payload: flattenArr(resLedger.data),
      });

      setCurrentDate({
        year,
        month,
      });
      setIsLoading(false);
      // return res;//返不返回都可以
    }),
    getEditData: withLoader(async (id) => {
      //創建頁重整可取得編輯資料
      let promiseArr = [];

      if (Object.keys(categories).length === 0) {
        promiseArr.push(api.get('/category'));
      } else {
        promiseArr.push(new Promise((resolve) => resolve(null)));
      }

      const isItemAlreadyFetched = !!(
        Object.keys(ledgerStore).indexOf(id) > -1
      );
      if (id && !isItemAlreadyFetched) {
        const getUrlWithId = `/ledger/${id}`;
        promiseArr.push(api.get(getUrlWithId));
      }

      const [resCategory, resEditItem] = await Promise.all(promiseArr);

      const finalCategory = resCategory
        ? flattenArr(resCategory.data)
        : categories;
      const finalEditItem = resEditItem ? resEditItem.data : ledgerStore[id];

      if (id) {
        // 編輯模式
        setCategories(finalCategory);
        setIsLoading(false);
        dispatchLedger({
          type: 'fetchItems',
          payload: {
            [id]: finalEditItem,
          },
        });
      } else {
        // 創建模式
        setCategories(finalCategory);
        setIsLoading(false);
      }

      return {
        categories: finalCategory,
        editItem: finalEditItem,
      };
    }),
    createData: withLoader(async (formData, selectedCategoryId) => {
      const newId = makeID();
      const dateObj = parseToYearsAndMonth(formData.date);
      const timestamp = new Date().getTime();

      const { data: newItem } = await api.post('/ledger', {
        ...formData,
        id: newId,
        cid: selectedCategoryId,
        monthCategory: `${dateObj.year}-${dateObj.month}`,
        timestamp,
      });

      dispatchLedger({
        type: 'addItem',
        payload: {
          newItem,
          newId,
        },
      });
      return newItem;
    }),
    editData: withLoader(async (formData, newCategoryId) => {
      const dateObj = parseToYearsAndMonth(formData.date);
      const timestamp = new Date(formData.date).getTime(); //@年月日轉排序

      const updatedItem = {
        ...formData,
        cid: newCategoryId,
        // timestamp,//%%會不小心把排序提升 創建有就好
        monthCategory: `${dateObj.year}-${dateObj.month}`,
      };
      const { data: modifiedItem } = await api.patch(
        `ledger/${formData.id}`,
        updatedItem
      );

      dispatchLedger({
        type: 'updateItem',
        payload: {
          id: modifiedItem.id,
          modifiedItem,
        },
      });

      return modifiedItem;
    }),
    deleteData: withLoader(async (item) => {
      const deleteItem = await api.delete(`/ledger/${item.id}`);
      dispatchLedger({
        type: 'deleteItem',
        payload: item,
      });
      setIsLoading(false);

      return deleteItem;
    }),
  };

  // const isAtLoginPage = useRouteMatch('/login');
  // // 等待回傳
  // if (!fbResponse) {
  //   return <></>;
  // }
  // // 處理使用者輸入其他網址
  // if (fbResponse.status !== 'connected' && !isAtLoginPage) {
  //   return <Redirect to="/login" />;
  // }

  return (
    // <AuthContext.Provider
    //   value={{
    //     status: fbResponse.status,
    //     authResponse: fbResponse.authResponse,
    //     handleFBLogin,
    //     handleFBLogout,
    //   }}
    // >
    <AppContext.Provider
      value={{
        categories: categories,
        ledgerStore,
        // dispatchLedger, //~~因為在父層做，幾乎不用 資料狀態在父層改變傳下去就好
        currentDate,
        isLoading,
        actions,
      }}
    >
      {/* <Router> */}
      <div className="App">
        <Route path="/" exact>
          {/* {fbResponse.status === 'connected' ? (
            <Home />
          ) : (
            <Redirect to="/login" />
          )} */}
          <Home />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/create" component={Create} />
        <Route path="/edit/:id" component={Create} />
      </div>
      {/* </Router> */}
    </AppContext.Provider>
    // </AuthContext.Provider>
  );
}

export default App;
