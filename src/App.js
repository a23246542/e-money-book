import { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import LedgerList from './components/LedgerList';
import ViewTab from './components/ViewTab';
import { LIST_VIEW, CHART_VIEW } from './constants';

function App() {

  const items = [
    {
      id: 1,
      title: '去雲南旅遊',
      price: 200,
      date: '2020-11-26',
      category: {
        id: '1',
        name: '旅行',
        type: 'outcome',
        iconName: 'IosPlane'
      },
    },
    {
      id: 2,
      title: '去台灣旅遊',
      price: 400,
      date: '2020-11-27',
      category: {
        id: '1',
        name: '旅行',
        type: 'outcome',
        iconName: 'IosPlane'
      },
    }
  ]

  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <ViewTab
        activeTab={ LIST_VIEW }
        onTabChange={(view)=>{ console.log(view);}}
      />
      <LedgerList 
        items={items}
        onModifyItem={(item)=>{ alert(item.title) }}
        onDeleteItem={(item)=>{ alert(item.title) }}
        ></LedgerList>
    </div>
  );
}

export default App;
