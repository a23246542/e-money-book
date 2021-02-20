import { useState, useReducer, useRef } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  useRouteMatch,
} from 'react-router-dom';
import '@/App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Home from '@/containers/Home';
import Create from '@/containers/Create';
import Login from '@/containers/Login';
import AppContext, { AppProvider } from './contexts/AppContext';
import AuthContext from './contexts/AuthContext';
import { flattenArr, parseToYearsAndMonth, makeID } from './helpers/utility';
import useFacebookLogin from './hooks/useFacebookLogin';
import useLedger from './hooks/useLedger';
import api from '@/api';

function App() {
  // const [fbResponse, handleFBLogin, handleFBLogout] = useFacebookLogin({
  //   appId: process.env.REACT_APP_FB_APP_ID,
  //   cookie: true,
  //   xfbml: true,
  //   version: process.env.REACT_APP_FB_APP_VERSION,
  // });
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
    <AppProvider>
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
    </AppProvider>
    // </AuthContext.Provider>
  );
}

export default App;
