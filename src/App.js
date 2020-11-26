import { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import PriceList from './components/PriceList';

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
        type: 'outcome'
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
        type: 'outcome'
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
      <PriceList 
        items={items}
        onModifyItem={(item)=>{ alert(item.title) }}
        onDeleteItem={(item)=>{ alert(item.title) }}
        ></PriceList>
    </div>
  );
}

export default App;
