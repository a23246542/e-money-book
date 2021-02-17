import React, { useState, useMemo, useEffect, useContext } from 'react';
import { withRouter, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Tabs, Tab } from '../components/Tabs';
import { TYPE_OUTCOME, TYPE_INCOME } from '../constants';
import Icon from '../components/common/Icon';
import CategorySelect from '../components/CategorySelect';
import LedgerForm from '../components/LedgerForm';
import Loader from '../components/common/Loader';
import { testTabs, testCategories, testItems } from '../testData';
import AppContext from '../AppContext';

export const CreatePage = ({ match, history }) => {
  const { categories, ledgerStore, isLoading, actions } = useContext(
    AppContext
  );

  const [selectedTab, setTab] = useState(TYPE_OUTCOME);
  const [selectedCategory, setCategory] = useState(null);
  const [validationPassed, setValidation] = useState(true);

  useEffect(() => {
    const { id } = match.params;
    actions.getEditData(id).then((data) => {
      const { editItem, categories } = data;
      setTab(id && editItem ? categories[editItem.cid].type : TYPE_OUTCOME);
      setCategory(id && editItem ? categories[editItem.cid] : null);
    });
  }, ['']);

  const tabChange = (index) => {
    setTab(testTabs[index].value);
  };

  const selectCategory = (category) => {
    setCategory(category);
  };

  const cancelSubmit = () => {
    history.push('/');
  };

  const submitForm = (formData, isEditMode) => {
    // if(!selectedCategory.id) {//@@@ 會因為null.id報錯
    if (!selectedCategory) {
      setValidation(false);
      return;
    }
    if (!isEditMode) {
      //創建模式
      actions.createData(formData, selectedCategory.id).then(() => {
        history.push('/');
      });
    } else {
      //編輯模式
      actions.editData(formData, selectedCategory.id).then(() => {
        history.push('/');
      });
    }
  };

  //fix 改CreateTabs 首頁改HomeTabs 迴圈
  const selectedTabIndex = useMemo(() => {
    return testTabs.findIndex((item) => item.value === selectedTab); //!!!
  }, [selectedTab]);

  //fix 改list
  const filterCategories = useMemo(() => {
    const categoryIdList = Object.keys(categories);
    return categoryIdList
      .filter((id) => categories[id].type === selectedTab)
      .map((id) => categories[id]);
    // },[categoryIdList.length,selectedTab])
  }, [selectedTab, categories]);

  const { id } = match.params;
  const editItem = id && ledgerStore[id] ? ledgerStore[id] : {};

  return (
    <div className="create-page py-3 px-3">
      {isLoading && <Loader />}
      <Tabs activeIndex={selectedTabIndex} onTabChange={tabChange}>
        {testTabs.map((item, index) => {
          return (
            <Tab key={index}>
              {<Icon icon={item.iconName} />}
              {item.text}
            </Tab>
          );
        })}
      </Tabs>
      <CategorySelect
        categories={filterCategories}
        selectedCategory={selectedCategory}
        onSelectCategory={selectCategory}
      />
      <LedgerForm
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

CreatePage.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
};

export default withRouter(CreatePage);
