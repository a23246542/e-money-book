import { useState, Fragment, useMemo, useEffect } from 'react';
import logo from '../logo.svg';

import { LIST_VIEW, CHART_VIEW } from '../constants';
import { parseToYearsAndMonth } from '../utilitiy';
import LedgerList from '../components/LedgerList';
import ViewTab from '../components/ViewTab';
import TotalNumber from '../components/TotalNumber';
import CreateBtn from '../components/CreateBtn';

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
  },
  3: {
    name: '投資',
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

const initItemsWithCategory = items.map(item => { //!!@移到外面就不會切換時一直執行
  console.log('四次為一遍');
  item.category = category[item.categoryId];
  return item;
})


/* @param 
  ledgerList //帳目列表
  currentDate //當前年月
  totalIncome,totalOutcome //收入支出總和
  tabView //當前視圖信息
  帳目表的分類資訊跟月份資訊

*/
const Home = () => {

  // let initItemsWithCategory = []
  // useEffect(() => { //%%% useState會沒有資料 mounted才執行
  //   console.log('應該只跑一遍');
  //   initItemsWithCategory = items.map(item => {
  //     // console.log('四次為一遍');
  //     item.category = category[item.categoryId];
  //     return item;
  //   })
  // }, [''])

  // const initItemsWithCategory = items.map(item => {
  //   console.log('四次為一遍');
  //   item.category = category[item.categoryId];
  //   return item;
  // })

  // const itemsWithCategory = items.map(item => {
  //   item.category = category[item.categoryId];
  //   return item;
  // })

  const itemsWithCategory = useMemo(() => { //@@不適用這個!!
    console.log('跑itemsWithCategory');
    return items.map(item => {
      item.category = category[item.categoryId];
      return item;
    })
  },[items.length])//@@實驗 發現還是可以追蹤到items的變化

  console.log('78',itemsWithCategory); //!!!undefined ??useMemo是mounted之後


  const parseItemWithCategory = (items) => {
    return items.map(item =>{
      item.category = category[item.categoryId];
      return item
    })
  }
  
  // const [ items1, setItems1]  = useState(items);
  // const [ list, setList ] = useState(JSON.parse(JSON.stringify(initItemsWithCategory)));
  const [ list, setList ] = useState(initItemsWithCategory);
  // const [ list, setList ] = useState(itemsWithCategory);//%%%初始值不能變化
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
  const modifyItem = (clickedItem) => {
    let newList = [];
    newList = list.map((item) => {
      if(item.id === clickedItem.id) {
        return {...item, title:'this is new Title'}
      } else {
        return item;
      }
    })
    setList(newList);

  };
  const createItem = () => {
    // let newList = [...list];
    // const lastId = newList[newList.length-1].id;
    // const newItem =  {
    //   id: lastId + 1,
    //   title: '創富投資',
    //   price: 400,
    //   date: '2020-11-28',
    //   categoryId: 3,
    // };
    // newList.push(newItem);
    // setList(newList);
    const lastId = items[items.length-1].id;
    const newItem =  {
      id: lastId + 1,
      title: '創富投資',
      price: 400,
      date: '2020-11-28',
      categoryId: 3,
    };
    items.push(newItem);
    console.log('setList之前',items,list);
    setList(parseItemWithCategory(items))
    // setList(itemsWithCategory)//
    console.log(items,list);//@@@比setList還慢印出來
    setTimeout(()=>{
      console.log(items,list);//@@@印出來list比items少一個，但畫面上的list是對的
    },1000)
    
  };
  const deleteItem = (clickedItem) => {
    let newList = [];
    newList = list.filter(item => {
      return item.id !== clickedItem.id
    })
    setList(newList);
  };

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
        <CreateBtn
          onCreateItem={ createItem }
        />
        { tabView === LIST_VIEW &&
          <LedgerList 
            items={list}
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