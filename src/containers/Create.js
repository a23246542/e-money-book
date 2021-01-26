import React, { useState, useMemo, useEffect, useContext } from 'react';
import { withRouter, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import Ionicons, { IosCard, IosCash } from '../plugin/ionicons';
import { Tabs, Tab } from '../components/Tabs';
import { TYPE_OUTCOME, TYPE_INCOME } from '../constants';
import CategorySelect from '../components/CategorySelect';
import LedgerForm from '../components/LedgerForm';
import Loader from '../components/common/Loader';
// import { categories } from '../components/__test__/CategorySelect2.test';
import { testTabs, testCategories, testItems } from '../testData';
import AppContext from '../AppContext';

export const CreatePage = ({ match, history }) => {
  //@parmas
  //收入還是支出 tab切換 selectedTab
  //收入還是支出 分類切換 selectedCategory
  //展示表單 空或是item

  const { id } = match.params;
  // const { id }  = useParams();
  // console.log('Create.js id',id);
  console.log('Create.js id', id);
  const {
    categories,
    ledgerStore,
    isLoading,
    actions,
  } = useContext(AppContext);
  // const [selectedTab,setTab] = useState('支出');
  // const [ selectedTab, setTab ] = useState(TYPE_OUTCOME);//字串
  // console.log(id,ledgerStore);
  const [selectedTab, setTab] = useState(
    id && ledgerStore[id] ? categories[ledgerStore[id].cid].type : TYPE_OUTCOME
  ); // !每次重新執行
  const [selectedCategory, setCategory] = useState(
    id && ledgerStore[id] ? categories[ledgerStore[id].cid] : null
  );
  const [validationPassed, setValidation] = useState(true);
  const editItem = id && ledgerStore[id] ? ledgerStore[id] : {};
  // const editItem = id && ledgerStore[id] ? ledgerStore[id] : null;
  // const [activeIndex,setIndex] = useState(0);
  const selectedTabIndex = useMemo(() => {
    return testTabs.findIndex((item) => item.value === selectedTab); //!!!
  }, [selectedTab]);

  // console.log('Create.js',selectedCategory,id,!!ledgerStore,!!categories);
  // console.log('action',actions);

  useEffect(() => {
    //判斷有無加載過交由App.js
    // const b = actions.getEditData();
    // console.log('create',b);
    console.log('Create', actions);
    // actions.getEditData('测试id').then((data) => {
    actions.getEditData(id).then((data) => {
      //@@因為有await才會return then
      // console.log('Create.js data',data);
      //@@似乎不寫這些也行
      // const { editItem, categories } = data;
      // setTab(id && editItem ? categories[editItem.cid].type:TYPE_OUTCOME);
      // setCategory(id && editItem? categories[editItem.cid]: null);
    });
  }, ['']);

  const categoryIdList = Object.keys(categories);

  const filterCategories = useMemo(() => {
    return categoryIdList
      .filter((id) => categories[id].type === selectedTab)
      .map((id) => categories[id]);
    // },[categoryIdList.length,selectedTab])
  }, [categoryIdList, selectedTab, categories]);

  const tabChange = (index) => {
    setTab(testTabs[index].value);
  };

  const selectCategory = (category) => {
    console.log('Create.js設置', category);
    setCategory(category);
  };

  const cancelSubmit = () => {
    history.push('/');
  };

  const submitForm = (formData, isEditMode) => {
    // if(!selectedCategory.id) {//@@@ null.id不行
    console.log('submitForm被觸發11', !isEditMode, selectedCategory);
    if (!selectedCategory) {
      setValidation(false);
      return;
    }
    //create
    if (!isEditMode) {
      // dispatchLedger({
      //   type: 'createItem',
      //   payload: {
      //     formData,
      //     // isEditMode %%%造成cid為undefined
      //     selectedCategoryId:selectedCategory.id
      //   }
      // });
      // setTimeout(()=>{
      //   history.push('/');
      // },0)
      console.log('觸發actions.createData', formData, selectedCategory.id);

      actions.createData(formData, selectedCategory.id).then(() => {
        history.push('/');
      });
      //edit
    } else {
      // dispatchLedger({
      //   type: 'updateItem',
      //   payload: {
      //     formData,
      //     // newCategoryId: selectedCategory,/%%% bug半天
      //     newCategoryId: selectedCategory.id,
      //   }
      // })
      // setTimeout(()=>{
      //   console.log(ledgerStore);
      //   history.push('/');
      // },0)
      console.log('create編輯模式', formData, selectedCategory.id);
      actions.editData(formData, selectedCategory.id).then(() => {
        console.log('----跳回首頁----');
        history.push('/');
      });
    }
  };
  // console.log('selectedCategory',selectedCategory);
  return (
    <div className="create-page py-3 px-3">
      {isLoading && <Loader />}
      {/* <Tabs tabIndex="0"> 跟vue不一樣 %%%*/}
      {/* <Tabs tabIndex={0} onTabChange={tabChange}> */}
      <Tabs activeIndex={selectedTabIndex} onTabChange={tabChange}>
        {testTabs.map((item, index) => {
          const Icon = Ionicons[item.iconName];
          return (
            <Tab key={index}>
              {/* {Ionicons[item.iconName]}{item.title} //@@無效 */}
              {<Icon color={index === selectedTabIndex ? '#fff' : null} />}
              {item.text}
            </Tab>
          );
        })}
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
        {!validationPassed && (
          <div className="alert alert-warning">請選擇分類選項</div>
        )}
      </LedgerForm>
    </div>
  );
};

CreatePage.propTypes = {};

export default withRouter(CreatePage);
