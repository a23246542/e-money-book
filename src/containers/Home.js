import { useState, Fragment, useMemo } from 'react';
import logo from '../logo.svg';

import { LIST_VIEW, CHART_VIEW } from '../constants';
import LedgerList from '../components/LedgerList';
import ViewTab from '../components/ViewTab';
import TotalNumber from '../components/TotalNumber';

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

const Home = () => {
  const {totalIncome, totalOutcome} = useMemo(()=>{
    // let totalIncome,totalOutcome; //%%%沒給型別變NaN = undefined + number
    let totalIncome = 0,totalOutcome = 0;
    items.forEach(item => {
      if(item.category.type === 'outcome') {
        totalOutcome += item.price;
      } else {
        totalIncome += item.price
      }
    })
    console.log('count total');
    return { totalIncome, totalOutcome }
  },[items.length])

  return (
    <Fragment>
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
        <div className="headerWrap">
          <div className="row">
            <div className="col">月份選擇</div>
            <div className="col">
              <TotalNumber
                income={totalIncome}
                outcome={totalOutcome}
              />
            </div>
          </div>
        </div>
      </header>
      <div className="content-area py-3 px-3">
        <ViewTab
          activeTab={ LIST_VIEW }
          onTabChange={(view)=>{ console.log(view);}}
        />
        <p>createBtn</p>
        <LedgerList 
          items={items}
          onModifyItem={(item)=>{ alert(item.title) }}
          onDeleteItem={(item)=>{ alert(item.title) }}
          ></LedgerList>
      </div>
    </Fragment>
  )
}


export default Home;