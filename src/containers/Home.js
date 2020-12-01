import { useState, Fragment, useMemo } from 'react';
import logo from '../logo.svg';

import { LIST_VIEW, CHART_VIEW } from '../constants';
import { parseToYearsAndMonth } from '../utilitiy';
import LedgerList from '../components/LedgerList';
import ViewTab from '../components/ViewTab';
import TotalNumber from '../components/TotalNumber';

const category = {
  1: {
    name: '旅行',
    type: 'outcome',
    iconName: 'IosPlane'
  },
  2: {
    name: '領薪水',
    type: 'income',
    iconName: 'IosPlane'
  }
}

const items = [
  {
    id: 1,
    title: '去雲南旅遊',
    price: 200,
    date: '2020-11-26',
    categoryId: 1, 
  },
  {
    id: 2,
    title: '領薪水',
    price: 1000,
    date: '2020-11-26',
    categoryId: 2,
  },
  {
    id: 3,
    title: '去台灣旅遊',
    price: 400,
    date: '2020-11-27',
    categoryId: 1,
  },
]
/* @param 
  ledgerList //帳目列表
  currentDate //當前年月
  totalIncome,totalOutcome //收入支出總和
  tabView //當前視圖信息
  帳目表的分類資訊跟月份資訊
*/
const Home = () => {
  const itemsWithCategory = items.map(item => {
    item.category = category[item.categoryId];
    return item;
  })

  const [ list, setList ] = useState(itemsWithCategory);
  const [ currentDate, setCurrentDate ] = useState(parseToYearsAndMonth())
  const [ tabView, setTabView ] = useState(CHART_VIEW);

  const {totalIncome, totalOutcome} = useMemo(()=>{
    // let totalIncome,totalOutcome; //%%%沒給型別變NaN = undefined + number
    let totalIncome = 0,totalOutcome = 0;
    list.forEach(item => {
      if(item.category.type === 'outcome') {
        totalOutcome += item.price;
      } else {
        totalIncome += item.price
      }
    })
    console.log('count total');
    return { totalIncome, totalOutcome }
  },[list.length])

  const changeDate = () => {};
  const changeView = (view) => {
    setTabView(view);
  };
  const modifyItem = () => {};
  const createItem = () => {};
  const deleteItem = () => {};

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
          activeTab={ tabView }
          onTabChange={ changeView }
        />
        <p>createBtn</p>
        { tabView === LIST_VIEW &&
          <LedgerList 
            items={items}
            onModifyItem={modifyItem}
            onDeleteItem={deleteItem}
            ></LedgerList>
        }
        {
          tabView === CHART_VIEW &&
          "這裡是圖表模式"
        }
      </div>
    </Fragment>
  )
}


export default Home;