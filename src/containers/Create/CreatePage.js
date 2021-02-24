import React, { useState, useMemo, useEffect, useContext, useRef } from 'react';
import { withRouter, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Loader, IconItem } from '@/components/common';
import { CategorySelect, LedgerForm, Tabs, Tab } from '@/components';
import { TYPE_OUTCOME, TYPE_INCOME } from '@/helpers/constants';
import AppContext from '@/contexts/AppContext';

export const CreatePageComponent = ({ match, history }) => {
  const { categories, ledgerStore, isLoading, actions } = useContext(
    AppContext
  );

  const [selectedTab, setTab] = useState(TYPE_OUTCOME);
  const [selectedCategory, setCategory] = useState(null);
  const [validationPassed, setValidation] = useState(true);
  const [state1, setState1] = useState(0);
  // const { current: actionsRef } = useRef(actions);
  const actionsRef = useRef(actions);

  useEffect(() => {
    const { id } = match.params;
    actionsRef.current.getEditData(id).then((data) => {
      const { editItem, categories } = data;
      setTab(id && editItem ? categories[editItem.cid].type : TYPE_OUTCOME);
      setCategory(id && editItem ? categories[editItem.cid] : null);
    });
  }, [actionsRef, match.params]);

  const createPageTabs = useRef([
    {
      text: '支出',
      value: TYPE_OUTCOME,
      iconName: 'IosCard',
    },
    {
      text: '收入',
      value: TYPE_INCOME,
      iconName: 'IosCash',
    },
  ]);

  const tabChange = (index) => {
    setTab(createPageTabs.current[index].value);
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
      actionsRef.current.createData(formData, selectedCategory.id).then(() => {
        history.push('/');
      });
    } else {
      //編輯模式
      actionsRef.current.editData(formData, selectedCategory.id).then(() => {
        history.push('/');
      });
    }
  };

  //fix 改CreateTabs 首頁改HomeTabs 迴圈
  const selectedTabIndex = useMemo(() => {
    return createPageTabs.current.findIndex(
      (item) => item.value === selectedTab
    ); //!!!
  }, [selectedTab, createPageTabs]);

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
        {createPageTabs.current.map((item, index) => {
          return (
            <Tab key={index}>
              {<IconItem icon={item.iconName} />}
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

CreatePageComponent.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
};

// export default withRouter(CreatePage);
export const CreatePage = withRouter(CreatePageComponent);
