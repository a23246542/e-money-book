import React,{ useState,useMemo, useContext } from 'react'
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Ionicons,{ IosCard, IosCash } from '../plugin/ionicons';
import { Tabs, Tab } from '../components/Tabs';
import { TYPE_OUTCOME, TYPE_INCOME } from '../constants';
import CategorySelect from '../components/CategorySelect';
import LedgerForm from '../components/LedgerForm';
// import { categories } from '../components/__test__/CategorySelect2.test';
import { testTabs, testCategories, testItems} from '../testData';
import AppContext from '../AppContext';



const Create = ({ match, history }) => {
  //@parmas
  //收入還是支出 tab切換 selectedTab
  //收入還是支出 分類切換 selectedCategory
  //展示表單 空或是item

  const { id } = match.params;
  const { categories, dispatchLedger, ledgerStore} = useContext(AppContext);
  // const [selectedTab,setTab] = useState('支出');
  // const [ selectedTab, setTab ] = useState(TYPE_OUTCOME);//字串
  console.log(id,ledgerStore);
  const [ selectedTab, setTab ] = useState( id && ledgerStore[id] ? categories[ledgerStore[id].cid].type:TYPE_OUTCOME );// !每次重新執行
  const [ selectedCategory, setCategory ] = useState( id && ledgerStore[id]? categories[ledgerStore[id].cid]: null);
  const [ validationPassed, setValidation ] = useState(true);
  const editItem = id && ledgerStore[id] ? ledgerStore[id] : {};
  // const [activeIndex,setIndex] = useState(0);
  const selectedTabIndex = useMemo(()=>{
    return testTabs.findIndex(item=>item.value === selectedTab);//!!!
  },[selectedTab])



  const categoryIdList = Object.keys(categories);

  const filterCategories = useMemo(()=>{
    return categoryIdList.filter(id =>categories[id].type === selectedTab)
    .map(id =>categories[id]);
  // },[categoryIdList.length,selectedTab])
  },[categoryIdList,selectedTab,categories])

  const tabChange = (index) => {
    setTab(testTabs[index].value)
  }

  const selectCategory = (category) => {
    setCategory(category);
  }

  const cancelSubmit = () => {
    history.push('/');
  }

  const submitForm = (formData, isEditMode) => {
    // if(!selectedCategory.id) {//@@@ null.id不行
    if(!selectedCategory) {
      setValidation(false);
      return;
    }
    //create
    if(!isEditMode) {
      dispatchLedger({
        type: 'createItem',
        payload: {
          formData,
          // isEditMode %%%造成cid為undefined
          selectedCategoryId:selectedCategory.id
        }
      });
      setTimeout(()=>{
        history.push('/');
      },0)
    //edit
    } else {
      dispatchLedger({
        type: 'updateItem',
        payload: {
          formData,
          // updatedCategoryId: selectedCategory,/%%% bug半天
          updatedCategoryId: selectedCategory.id,
        }
      })
      setTimeout(()=>{
        console.log(ledgerStore);
        history.push('/');
      },0)
    }
  }

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
        // selectedCategory={} //%%%不能传入空 所以没传老师干脆没写 不過組件內還是可解構出來
        selectedCategory={selectedCategory}
        onSelectCategory={selectCategory}
      />
      <LedgerForm
        // ledgerItem={}
        ledgerItem={editItem}
        onFormSubmit={submitForm}
        onCancelSubmit={cancelSubmit}
      >
        {
          !validationPassed &&
          <div className="alert alert-warning">
            請選擇分類選項
          </div>
        }
      </LedgerForm>
    </div>
  )
}

Create.propTypes = {

}

export default withRouter(Create)
