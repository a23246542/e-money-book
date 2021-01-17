import { useState, Fragment, useMemo, useEffect, useContext, useCallback } from 'react';
import { useRouteMatch, withRouter } from 'react-router-dom';
import logo from '../logo.svg';

import { LIST_VIEW, CHART_VIEW, TYPE_OUTCOME, TYPE_INCOME } from '../constants';
import { parseToYearsAndMonth, padLeft } from '../utility';
import LedgerList from '../components/LedgerList';
import ViewTab from '../components/ViewTab';
import TotalNumber from '../components/TotalNumber';
import CreateBtn from '../components/CreateBtn';
import MonthPicker from '../components/MonthPicker';
import { Tabs, Tab } from '../components/Tabs(bad)';
import AppContext from '../AppContext';
// import {Tabs, Tab} from '../components/Tabs';
import Loader from '../components/common/Loader';
import PieChart from '../components/PieCharts';


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
const generateChartDataByCategory = (ledgerItemsWithCategory, type = TYPE_OUTCOME ) => {
  let categoryMap = {};
  ledgerItemsWithCategory.filter(item => item.category.type === type)
  .forEach(item => {
    if (categoryMap[item.cid]) {
      categoryMap[item.cid].value += (item.amount*1);
      categoryMap[item.cid].items.push(item.id);
    } else {
      categoryMap[item.cid] = {
        name: item.category.name,
        value: item.amount * 1,
        items: [item.id]
      }
    }
  })
  return Object.values(categoryMap);
}


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

  const {
    categories,
    ledgerStore,
    // dispatchLedger,
    currentDate,
    isLoading,
    actions,
  } = useContext(AppContext);

  // const [ list, setList ] = useState(JSON.parse(JSON.stringify(initItemsWithCategory)));//@@不需 會自動深拷貝
  // const [ list, setList ] = useState(items);
  // const [ list, setList ] = useState(itemsWithCategory);//%%%初始值不能變化
  // const [ currentDate, setCurrentDate ] = useState(parseToYearsAndMonth())
  //@@ 是否應該改用ref 因為update情況下 useState不會重取
  const [ tabView, setTabView ] = useState(LIST_VIEW);

  // console.log('獲取資料',categories,ledgerStore);
  // const listWithCategory  = useMemo(()=>{ //切換tabView不會重新來
  //   console.log('執行listWithCategory');
  //   return list.map(item=>{
  //     item.category = categories[item.cid];
  //     return item;
  //   })
  // },[list.length])
  // const ledgerIdList = Object.keys(ledgerStore)// @@移到下面避免重新渲染

  useEffect(() => {
    console.log('home觸發actions');
    actions.getInitData();
  },[''])//@@兩次api
  // },[ledgerStore])
  // },[Object.keys(ledgerStore).length])// @@三次api


  const categoriesLen = Object.keys(categories).length;
  const ledgerLen = Object.keys(ledgerStore).length;

  const listWithCategory = useMemo(()=>{
    // console.log('計算listWithCategory');
    // let cloneObj = [...ledgerItems];//%%無法展開
    // console.log(!categoriesLen > 0 ,!ledgerLen > 0)
    // if(!categoriesLen > 0 && !ledgerLen > 0 ) { //%%%% &&邏輯想錯
    if(!categoriesLen > 0 || !ledgerLen > 0 ) { //%%%% &&邏輯想錯
      return []
    }
    // console.log('idididid',ledgerStore);
    const ledgerIdList = Object.keys(ledgerStore);
    let cloneObj = JSON.parse(JSON.stringify(ledgerStore));
    // console.log('cloneObj',cloneObj);
    return ledgerIdList
    .map((id) => {
      // console.log(cloneObj[id]);
      cloneObj[id].category = categories[ledgerStore[id].cid];//@@原本會改到
      return cloneObj[id];
    // },{...ledgerItems})//%%%回傳物件
    })
  // },[ledgerLen,categoriesLen])
  },[categories,ledgerStore])//!!!是否換掉物件 不需ledgerStore.length可重新計算
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

  // const filteredListWithCategory = useMemo(()=>{
  //   console.log('計算filteredListWithCategory');

  //   const currentDateArr = Object.values(currentDate);
  //   // currentDateArr[1] = padLeft(currentDateArr[1]);
  //   const currentDateStr = currentDateArr.join('-');

  //   return listWithCategory.filter((item)=>{
  //     return item.monthCategory.includes(currentDateStr)
  //     // return item.date.includes(`${currentDate.year}-${padLeft(currentDate.month)}`);//!!更简易
  //   })
  // // },[ledgerIdList.length, currentDate.month, listWithCategory.length])
  // // },[currentDate.month, listWithCategory.length])
  // },[currentDate,listWithCategory])

  const {totalIncome, totalOutcome} = useMemo(()=>{ //用另一個computed來計算
    // console.log('跑listWithCategory.forEach',categories,listWithCategory);
    // let totalIncome,totalOutcome; //%%%沒給型別變NaN = undefined + number
    if(!listWithCategory.length>0 || !categoriesLen>0) return {totalIncome:0, totalOutcome:0};
    let totalIncome = 0,totalOutcome = 0;
    // list.forEach(item => {
    listWithCategory.forEach(item => {
      // if(item.category.type === 'outcome') {
      try{
        if(categories[item.cid].type === 'outcome') {
          totalOutcome += item.amount;
        } else {
          totalIncome += item.amount;
        }
      } catch {
        console.log(item);
        throw new Error(item);
      }
    })
    // console.log('計算total');
    return { totalIncome, totalOutcome }
  // },[ledgerIdList.length])
  // },[filteredListWithCategory.length])
  // },[listWithCategory.length,categoriesLen])//@@
  },[listWithCategory,categories])


  const changeDate = useCallback((yearNum,monthNum) => {
    // setCurrentDate({//放在父層去做了
    //   year:yearNum,
    //   month:monthNum
    // })
    actions.selectNewMonth(yearNum,monthNum);
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
    // dispatchLedger({
    //   type:'deleteItem',
    //   payload: clickedItem
    // });
    actions.deleteData(clickedItem);
  };

  const chartOutcomeDataByCategory = generateChartDataByCategory(listWithCategory,TYPE_OUTCOME);
  const chartIncomeDataByCategory = generateChartDataByCategory(listWithCategory,TYPE_INCOME);
  // console.log('listWithCategory',listWithCategory,categories);
  // console.log('支出圖表資料',chartOutcomeDataByCategory);
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
        { isLoading &&
          <Loader/>
        }
        { !isLoading &&
          <Fragment>
              <ViewTab
                activeTab={ tabView }
                onTabChange={ changeView }
              />
              <CreateBtn
                onCreateItem={ createItem }
              />
              { tabView === LIST_VIEW && listWithCategory.length > 0 &&
                <LedgerList
                  // items={list} //!
                  // items={listWithCategory.filter(item=>{
                  //   const currentDateStr =  Object.values(currentDate).join('-');
                  //   return item.date.includes(currentDateStr);
                  // })}// 改放入計算後的值!!
                  items = { listWithCategory }
                  onModifyItem={modifyItem}
                  onDeleteItem={deleteItem}
                  // categories={categories}
                  ></LedgerList>
              }
              { tabView === LIST_VIEW && listWithCategory.length === 0 &&
                <div className="no-record alert alert-light text-center">
                  您還沒有記帳紀錄
                </div>
              }
              {
                tabView === CHART_VIEW && (
                  <Fragment>
                    <PieChart 
                      title="本月支出"
                      type={TYPE_OUTCOME}
                      categoryData={chartOutcomeDataByCategory} 
                      />
                    <PieChart 
                      title="本月收入"
                      type={TYPE_INCOME}
                      categoryData={chartIncomeDataByCategory}
                    />
                  </Fragment>
                )
              }
          </Fragment>
        }
      </div>
    </Fragment>
  )
}


export default withRouter(Home);
