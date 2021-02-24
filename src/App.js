import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import '@/App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { HomePage, CreatePage, LoginPage } from '@/containers';
import { AppProvider } from './contexts/AppContext';
import AuthContext from './contexts/AuthContext';
import useFacebookLogin from './hooks/useFacebookLogin';

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
        <Switch>
          <Route path="/" exact>
            {/* {fbResponse.status === 'connected' ? (
            <Home />
          ) : (
            <Redirect to="/login" />
          )} */}
            <HomePage />
          </Route>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/create">
            <CreatePage />
          </Route>
          <Route path="/edit/:id">
            <CreatePage />
          </Route>
          <Route render={() => <h1>404 not found 頁面去火星了</h1>} />
        </Switch>
      </div>
    </AppProvider>
    // </AuthContext.Provider>
  );
}

export default App;
