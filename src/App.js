import { useState } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'; 
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Home from './containers/Home';
import Create from './containers/Create';

function App() {
  return (
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
  );
}

export default App;
