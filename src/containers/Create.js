import React,{ useState,useMemo } from 'react'
import PropTypes from 'prop-types'
import Ionicons,{ IosCard, IosCash } from '../plugin/ionicons';
import { Tabs, Tab } from '../components/Tabs';
import { TYPE_OUTCOME, TYPE_INCOME } from '../constants';

const tabs = [
  {
    text:'支出',
    value: TYPE_OUTCOME,
    iconName:'IosCard'
  },
  {
    text:'收入',
    value:TYPE_INCOME,
    iconName:'IosCash'
  },
  {
    text:'其他',
    value:'other',
    iconName:'IosCash'
  },
]

const Create = ({ match }) => {
  //@parmas
  //收入還是支出 tab切換 selectedTab
  //收入還是支出 分類切換 selectedCategory
  //展示表單 空或是item

  // const [selectedTab,setTab] = useState('支出');
  const [selectedTab,setTab] = useState(TYPE_OUTCOME);

  // const [activeIndex,setIndex] = useState(0);
  const selectedTabIndex = useMemo(()=>{
    return tabs.findIndex(item=>item.value === selectedTab);//!!!
  },[selectedTab]) 

  const tabChange = (index) => {
    setTab(tabs[index].value)
  }

  return (
    <div>
      {match.params.id}頁
      {/* <Tabs tabIndex="0"> 跟vue不一樣 %%%*/}
      {/* <Tabs tabIndex={0} onTabChange={tabChange}> */}
      <Tabs activeIndex1={selectedTabIndex} onTabChange={tabChange}>
        {/* <Tab>支出</Tab>
        <Tab>收入</Tab>
        <Tab>其他</Tab> */}
        {
          tabs.map((item,index)=>{
          const Icon = Ionicons[item.iconName];
            return(
              <Tab>
                {/* {Ionicons[item.iconName]}{item.title} //@@無效 */}
                {<Icon/>}{item.text}
              </Tab>
            )
          })
        }
      </Tabs>
    </div>
  )
}

Create.propTypes = {

}

export default Create
