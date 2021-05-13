import { Route, Switch } from 'react-router-dom';
import '@/App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { HomePage, CreatePage, LoginPage } from '@/containers';
import { AppProvider } from '@/contexts/AppContext';
import { AuthProvider } from '@/contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <div className="App">
          <Switch>
            <Route path="/" exact>
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
    </AuthProvider>
  );
}

export default App;
