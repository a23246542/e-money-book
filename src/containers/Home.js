import { useState, Fragment, useMemo, useEffect, useContext, useCallback } from 'react';
import { useRouteMatch, withRouter } from 'react-router-dom';
import logo from '../logo.svg';

import { LIST_VIEW, CHART_VIEW } from '../constants';
import { parseToYearsAndMonth, padLeft } from '../utility';
import LedgerList from '../components/LedgerList';
import ViewTab from '../components/ViewTab';
import TotalNumber from '../components/TotalNumber';
import CreateBtn from '../components/CreateBtn';
import MonthPicker from '../components/MonthPicker';
import { Tabs, Tab } from '../components/Tabs(bad)';
import AppContext from '../AppContext';
// import {Tabs, Tab} from '../components/Tabs';


// const initItemsWithCategory = items.map(item => { //!!@移到外面就不會切換時一直執行
//   console.log('四次為一遍');
//   item.category = category[item.categoryId];
//   return item;
// })


/* @param
  ledgerList //帳目列表
  currentDate //當前年月
  totalIncome,totalOutcome //收入支出總和
  tabView //當前視圖信息
  帳目表的分類資訊跟月份資訊

*/
const Home = ({history, match}) => {

  // let initItemsWithCategory = []
  // useEffect(() => { //%%% useState會沒有資料 mounted才執行
  //   console.log('應該只跑一遍');
  //   initItemsWithCategory = items.map(item => {
  //     // console.log('四次為一遍');
  //     item.category = category[item.categoryId];
  //     return item;
  //   })
  // }, [''])


  // const itemsWithCategory = useMemo(() => { //@@不適用這個!! 因為修改外部items 不會讓home重新執行
  //   console.log('跑itemsWithCategory');
  //   return items.map(item => {
  //     item.category = category[item.categoryId];
  //     return item;
  //   })
  // },[items.length])


  // const parseItemWithCategory = (items) => {
  //   return items.map(item =>{
  //     item.category = category[item.categoryId];
  //     return item
  //   })
  // }

  const { categories, ledgerStore, dispatchLedger} = useContext(AppContext);

  // const [ list, setList ] = useState(JSON.parse(JSON.stringify(initItemsWithCategory)));//@@不需 會自動深拷貝
  // const [ list, setList ] = useState(items);
  // const [ list, setList ] = useState(itemsWithCategory);//%%%初始值不能變化
  const [ currentDate, setCurrentDate ] = useState(parseToYearsAndMonth())
  //@@ 是否應該改用ref 因為update情況下 useState不會重取
  const [ tabView, setTabView ] = useState(LIST_VIEW);

  // const listWithCategory  = useMemo(()=>{ //切換tabView不會重新來
  //   console.log('執行listWithCategory');
  //   return list.map(item=>{
  //     item.category = categories[item.cid];
  //     return item;
  //   })
  // },[list.length])
  // const ledgerIdList = Object.keys(ledgerStore)// @@移到下面避免重新渲染

  const listWithCategory = useMemo(()=>{
    // let cloneObj = [...ledgerItems];//%%無法展開
    console.log('計算listWithCategory');
    const ledgerIdList = Object.keys(ledgerStore)
    let cloneObj = JSON.parse(JSON.stringify(ledgerStore));
    return ledgerIdList
    .map((id) => {
      cloneObj[id].category = categories[ledgerStore[id].cid];//@@原本會改到
      return cloneObj[id];
    // },{...ledgerItems})//%%%回傳物件
    })
  // },[ledgerIdList.length])
  },[categories,ledgerStore])//!!!換掉物件 不需ledgerStore.length可重新計算
  // },[])

  // ----------------------------------------------------
  // let cloneObj = JSON.parse(JSON.stringify(ledgerStore));
  // //@@可否箭頭立即函是
  // console.log('home',ledgerStore,ledgerIdList);

  // const listWithCategory = ledgerIdList
  // .map((id) => {
  //   cloneObj[id].category = categories[ledgerStore[id].cid];//@@原本會改到
  //   return cloneObj[id];
  // })
// ---------------------------------------------------------

  // const listWithCategory = list.map(item=>{ //切換tabView會重新來
  //   console.log('執行listWithCategory');
  //   item.category = category[item.categoryId];
  //   return item;
  // })

  const filteredListWithCategory = useMemo(()=>{
    console.log('計算filteredListWithCategory');

    const currentDateArr = Object.values(currentDate);
    // currentDateArr[1] = padLeft(currentDateArr[1]);
    const currentDateStr = currentDateArr.join('-');

    return listWithCategory.filter((item)=>{
      return item.monthCategory.includes(currentDateStr)
      // return item.date.includes(`${currentDate.year}-${padLeft(currentDate.month)}`);//!!更简易
    })
  // },[ledgerIdList.length, currentDate.month, listWithCategory.length])
  // },[currentDate.month, listWithCategory.length])
  },[currentDate,listWithCategory])

  const {totalIncome, totalOutcome} = useMemo(()=>{ //用另一個computed來計算
    // let totalIncome,totalOutcome; //%%%沒給型別變NaN = undefined + number
    let totalIncome = 0,totalOutcome = 0;
    // list.forEach(item => {
      console.log(listWithCategory);
    listWithCategory.forEach(item => {
      if(item.category.type === 'outcome') {
        totalOutcome += item.amount;
      } else {
        totalIncome += item.amount;
      }
    })
    console.log('計算total');
    return { totalIncome, totalOutcome }
  // },[ledgerIdList.length])
  // },[filteredListWithCategory.length])
  },[listWithCategory])


  const changeDate = useCallback((yearNum,monthNum) => {
    setCurrentDate({
      year:yearNum,
      month:monthNum
    })
    // Object.values(currentDate).join('-')
  },[]);

  const changeView = (view) => {
    setTabView(view);
  };

  const modifyItem = (clickedItem) => {
    // let newList = [];
    // newList = list.map((item) => {
    //   if(item.id === clickedItem.id) {
    //     return {...item, title:'this is new Title'}
    //   } else {
    //     return item;
    //   }
    // })
    // setList(newList);
    history.push(`edit/${clickedItem.id}`);
  };

  const createItem = () => {
    // const lastId = list[list.length-1].id;
    // const newItem = {
    //   id: lastId + 1,
    //   title: '創富投資',
    //   price: 400,
    //   date: '2020-11-28',
    //   categoryId: 3,
    // };
    // // setList(parseItemWithCategory(items))
    // setList([...list,newItem]);
    history.push('./create');

  };

  const deleteItem = (clickedItem) => {
    // let newList = [];
    // newList = list.filter(item => {
    //   return item.id !== clickedItem.id
    // })
    // setList(newList);
    dispatchLedger({
      type:'deleteItem',
      payload: clickedItem
    });

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
          Learn Code
        </a>
        <div className="headerWrap">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12 col-sm-6">
                <MonthPicker
                  year={currentDate.year}
                  month={currentDate.month}
                  choiceDate={useCallback((yearNum,monthNum)=>{
                    changeDate(yearNum,monthNum);
                  },[changeDate])}
                  path={match.path}
                />
              </div>
              <div className="col-12 col-sm-6">
                <TotalNumber
                  income={totalIncome}
                  outcome={totalOutcome}
                />
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="content-area py-3 px-3">
        {/* <Tabs selectedTab={tabView} onTabChange={changeView}>
          <Tab>列表</Tab>
          <Tab>圖表</Tab>
        </Tabs> */}
        <ViewTab
          activeTab={ tabView }
          onTabChange={ changeView }
        />
        <CreateBtn
          onCreateItem={ createItem }
        />
        { tabView === LIST_VIEW &&
          <LedgerList
            // items={list} //!
            // items={listWithCategory.filter(item=>{
            //   const currentDateStr =  Object.values(currentDate).join('-');
            //   return item.date.includes(currentDateStr);
            // })}// 改放入計算後的值!!
            items = { filteredListWithCategory }
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


export default withRouter(Home);
