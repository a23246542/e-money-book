import React,{ useState,useMemo, useContext } from 'react'
import PropTypes from 'prop-types'
import Ionicons,{ IosCard, IosCash } from '../plugin/ionicons';
import { Tabs, Tab } from '../components/Tabs';
import { TYPE_OUTCOME, TYPE_INCOME } from '../constants';
import CategorySelect from '../components/CategorySelect';
import LedgerForm from '../components/LedgerForm';
// import { categories } from '../components/__test__/CategorySelect2.test';
import { testTabs, testCategories, testItems} from '../testData';
import AppContext from '../AppContext';



const Create = ({ match }) => {
  //@parmas
  //收入還是支出 tab切換 selectedTab
  //收入還是支出 分類切換 selectedCategory
  //展示表單 空或是item

  const { categories } = useContext(AppContext);
  console.log(categories);

  // const [selectedTab,setTab] = useState('支出');
  const [selectedTab,setTab] = useState(TYPE_OUTCOME);//字串

  // const [activeIndex,setIndex] = useState(0);
  const selectedTabIndex = useMemo(()=>{
    return testTabs.findIndex(item=>item.value === selectedTab);//!!!
  },[selectedTab])

  const tabChange = (index) => {
    setTab(testTabs[index].value)
  }


  const categoryIdList = Object.keys(categories);

  const filterCategories = useMemo(()=>{
    return categoryIdList.filter(id =>categories[id].type === selectedTab)
    .map(id =>categories[id]);
  },[categoryIdList.length,selectedTab])


  return (
    <div>
      {/* <Tabs tabIndex="0"> 跟vue不一樣 %%%*/}
      {/* <Tabs tabIndex={0} onTabChange={tabChange}> */}
      <Tabs activeIndex={selectedTabIndex} onTabChange={tabChange}>
        {
          testTabs.map((item,index)=>{
          const Icon = Ionicons[item.iconName];
            return(
              <Tab key={index}>
                {/* {Ionicons[item.iconName]}{item.title} //@@無效 */}
                {<Icon/>}{item.text}
              </Tab>
            )
          })
        }
      </Tabs>
      {/* //@@要怎麼整個傳進去 */}
      {/* <CategorySelect {...categories} /> */}
      <CategorySelect
        categories={filterCategories}
        // selectedCategory={} //%%%不能传入空 所以没传老师干脆没写
        selectedCategory={categories[2]}
        onSelectCategory={()=>{}}
      />
      <LedgerForm
        // ledgerItem={}
        onFormSubmit={()=>{}}
        onCancelSubmit={()=>{}}
      />
    </div>
  )
}

Create.propTypes = {

}

export default Create
